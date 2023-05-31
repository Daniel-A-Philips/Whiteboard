import requests
from Blackboard.assignment import Assignment
import aiohttp
import asyncio
import time
import json
import os


class Downloader:
    def __init__(self, assignment_instances: list):
        self.__working_directory = os.getcwd()
        self.__assignmnet_instances = assignment_instances
        self.__course_id_file = f'{self.__working_directory}/Blackboard/course_ids.json'
        self.__cookie_file = f'{self.__working_directory}/Blackboard/assignment_headers.json'
        self.class_list = {}
        self.headers = {}
        self.urls = []
        self.make_urls()
        self.url_match_assignment = {}
        for url in self.urls:
            self.url_match_assignment[url] = self.__assignmnet_instances[self.urls.index(url)]
        self.load_course_ids()
        asyncio.run(self.download_data())

    def make_urls(self):
        with open(self.__cookie_file, 'r+') as file:
            self.headers = json.load(file)['headers']
        self.urls = [
            f'https://learn.dcollege.net/webapps/calendar/launch/attempt/_blackboard.platform.gradebook2.GradableItem-_{assignment.item_id}_1'
            for assignment in self.__assignmnet_instances]

    def load_course_ids(self):
        with open(self.__course_id_file, 'r+') as file:
            self.class_list = json.load(file)

    def create_urls(self):
        return [assignment.make_url() for assignment in self.__assignmnet_instances]

    async def download_data(self):
        start = time.time()
        print('starting data from async_assignment_downloader')
        async with aiohttp.ClientSession(headers=self.headers) as session:
            for url in self.urls:
                async with session.get(url) as resp:
                    data = await resp.content.read()
                    data = str(data).split('\\n')
                    self.url_match_assignment[url].get_ids(data)
                    self.url_match_assignment[url].get_class_name(self.class_list)
                    print(self.url_match_assignment[url].class_name)

        print(f'Asynchronous Time: {time.time() - start}')


def tester():
    classes = ['CI-103-F', 'CS-172-B', 'CIVIC-101-20', 'ENGL-20-F']
    assingments = [Assignment('_blackboard.platform.gradebook2.GradableItem-_2982534_1', classes),
                   Assignment('_blackboard.platform.gradebook2.GradableItem-_2981454_1', classes)]
    d = Downloader(assingments)
