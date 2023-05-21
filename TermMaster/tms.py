from gevent import monkey
def stub(*args, **kwargs):  # pylint: disable=unused-argument
    pass
monkey.patch_all = stub
import grequests
import json
import requests
from icecream import ic

class tms:
    class_urls = []
    def __init__(self):
        self.terms = []
        self.download_homepage()        
        self.headers = json.loads(open('./TermMaster/TMS_Headers.json','r').read())['headers']


    def get_terms_from_body(self, body):
        return [line for line in body if 'class="term"' in line]


    def download_homepage(self):
        self.terms = []
        url = 'http://termmasterschedule.drexel.edu'
        unparsed_body = requests.get(url).content.decode('utf-8')
        body = unparsed_body.split('\n')
        terms_raw = self.get_terms_from_body(body)
        for term in terms_raw:
            temp_term = term.split('>')[2:4]
            temp_term[0] = temp_term[0][len('&nbsp;&nbsp;<a href="') - 2:]
            temp_term[1] = temp_term[1][:temp_term[1].index('<')]
            self.terms.append([temp_term[1], temp_term[0]])
        return self.terms

    # Takes in the raw html line and extracts the data required from it
    def html_line_parser(self,line):
        return line.split('>', 1)[1][:-6]

    def class_page_parser(self, data, crn):
        data = data.split('\n')
        class_data = {}
        line_incr = [0,1,2,3,4,13,18,19,24]
        line_name = ['Subject Code', 'Course No.', 'Instr Type', 'Instr Method', 
                     'Sec', 'Course Title', 'Days', 'Times', 'Instructor']
        for i in range(len(data)):
            if '<td align="center" valign="center">' in data[i]:
                for f in range(len(line_incr)):
                    class_data[line_name[f]] = self.html_line_parser(data[i + line_incr[f]])
                break
        class_data['CRN'] = crn
        return class_data

    def download_class(self, crn, quarter):
        tms_homepage = self.download_homepage()
        jsessionid = tms_homepage[0][1].split(';')[1][tms_homepage[0][1].split(';')[1].index('=')+1:tms_homepage[0][1].split(';')[1].index('?')]
        # Replaces the holder for the session ID with the users ID
        self.headers['cookie'] = self.headers['cookie'].replace('INSERT_SESSION_ID',jsessionid)
        response = requests.post('https://termmasterschedule.drexel.edu/webtms_du/searchCourses', 
                                headers = self.headers, 
                                data=f'term.termDesc={quarter}&crseTitle=&crseNumb=&crn={crn}&campus.desc=Any')
        self.headers['cookie'] = self.headers['cookie'].replace(jsessionid,'INSERT_SESSION_ID')
        tms.class_urls.append(response.url)
        return self.class_page_parser(response.content.decode(),crn)        

    def get_all_class_info(self,class_info):
        all_class_info = []
        for foo in class_info:
            all_class_info.append(self.download_class(foo['CRN'], self.match_quarter(foo)))
        return all_class_info

    # Takes in all of the class info that has been parsed from the copied input
    # Matches the quarter number from blackboard to the quarter number from termmaster
    def match_quarter(self, info):
        for term_info in self.terms:
            if info['Quarter Number'] in term_info[1]:
                return term_info[0]

    @classmethod
    def send_class_urls(cls):
        unsent_urls = (grequests.get(unsent) for unsent in cls.class_urls)
        grequests.map(unsent_urls)