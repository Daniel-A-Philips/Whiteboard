from Blackboard.assignment import Assignment
import aiohttp
import asyncio
import time
import json
import os


class Downloader:
    def __init__(self, assignment_instances: list):
        self.__working_directory = os.getcwd()
        self.__assignment_instances = assignment_instances
        self.__course_id_file = f'{self.__working_directory}/Blackboard/course_ids.json'
        self.__cookie_file = f'{self.__working_directory}/Blackboard/assignment_headers.json'
        self.class_list = {}
        self.headers = {}
        self.urls = []
        self.make_urls()
        self.url_match_assignment = {}
        for url in self.urls:
            self.url_match_assignment[url] = self.__assignment_instances[self.urls.index(url)]
        self.load_course_ids()
        asyncio.run(self.download_data())

    def make_urls(self):
        with open(self.__cookie_file, 'r+') as file:
            self.headers = json.load(file)['headers']
        self.urls = [assignment.url for assignment in self.__assignment_instances]

    def load_course_ids(self):
        with open(self.__course_id_file, 'r+') as file:
            self.class_list = json.load(file)

    async def download_link(self, session: aiohttp.ClientSession, url: str):
        print(url)
        async with session.get(url) as response:
            resp = await response.content.read()
            return resp

    async def download_data(self, failed_try=0):
        start = time.time()
        print('starting data from async_assignment_downloader')
        self.urls = list(set(self.urls))
        failed_urls = []
        async with aiohttp.ClientSession(headers=self.headers, connector=aiohttp.TCPConnector(ssl=False)) as session:
            tasks = []
            for url in self.urls:
                tasks.append(asyncio.ensure_future(self.download_link(session, url)))
            downloaded = await asyncio.gather(*tasks)
            for data in downloaded:
                if 'Too Many Requests' in str(data) and failed_try < 4:
                    failed_urls.append(self.urls[downloaded.index(data)])
                    continue
                url = self.urls[downloaded.index(data)]
                split_data = str(data).split('\\n')
                self.url_match_assignment[url].get_ids(split_data)
                self.url_match_assignment[url].get_class_name(self.class_list)
                if self.url_match_assignment[url].class_name == 'No Name Found':
                    print(data)
                print(f'{self.urls.index(url)+1}/{len(self.urls)} : {self.url_match_assignment[url].class_name}')
            # Retry the failed urls
            if len(failed_urls) != 0 and failed_try < 4:
                print('Failed URLS:', failed_urls)
                prev_urls = self.urls
                self.urls = failed_urls
                # Recursion: Run download_data again but increment the number of failed tries
                # while using the failed urls
                await self.download_data(failed_try + 1)
                self.urls = prev_urls
                print(self.url_match_assignment)
        print(f'Asynchronous Time: {time.time() - start}')


def tester():
    classes = ['CI-103-F', 'CS-172-B', 'CIVIC-101-20', 'ENGL-20-F']
    assingments = [Assignment('_blackboard.platform.gradebook2.GradableItem-_2946159_1', classes),
                   Assignment('_blackboard.platform.gradebook2.GradableItem-_2946162_1', classes)]
    d = Downloader(assingments)