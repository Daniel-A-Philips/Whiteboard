import os
import json
import requests
from difflib import get_close_matches

class Assignment:
    
    def __init__(self, item_id, classes):
        self.headers = []
        self.url = ''
        self.item_id = item_id.split('_')[2]
        self.classes = classes
        self.course_id = ''
        self.content_id = ''
        self.class_name = ''
        self.complex_name = ''
        self.is_discussion_board = True
        self.__working_directory = os.getcwd()
        self.make_url()
        self.get_ids()
        if self.course_id == '':
            return
        self.get_class_name()
    
    def make_url(self):
        with open(f'{self.__working_directory}/Blackboard/assignment_headers.json','r+') as file:
            self.headers = json.load(file)['headers']
        self.url = f'https://learn.dcollege.net/webapps/calendar/launch/attempt/_blackboard.platform.gradebook2.GradableItem-_{self.item_id}_1'
    
    def get_ids(self):
        req = requests.get(self.url, headers=self.headers)
        if req.status_code == 403:
            print('** Error, please revalidate cookies! **')
            return
        lines = req.text.split('\n')
        for line in lines:
            self.is_discussion_board = 'discussion_board_entry' in line
            if 'breadcrumbs.rightMostParentURL' in line:
                data = line.split('\'')[1].split('?')[1].split('&')
                if not self.is_discussion_board:
                    self.course_id = data[0].split('=')[1].split('_')[1]
                    self.content_id = data[1].split('=')[1]
                else:
                    print('both')
                    self.course_id = data[2].split('=')[1].split('_')[1]
                break
    
    def get_class_name(self):
        with open(f'{self.__working_directory}/Blackboard/course_ids.json', 'r+') as file:
            all_classes = json.load(file)
            self.complex_name = all_classes.get(self.course_id, 'No Name Found')
            self.class_name = self.complex_name
            if self.complex_name == 'No Name Found':
                return
        if 'XLIST' in self.complex_name:
            #TODO
            for c in self.classes:
                if self.check_if_class_name_in_complex(c):
                    print(f'{c} is True')
                
            matches = get_close_matches(self.complex_name, self.classes, cutoff=0.3)
            self.class_name = matches[0]
    
    def check_if_class_name_in_complex(self, class_name):
        coll, num, sec = class_name.split('-')[:3]
        try:
            if self.complex_name.index(coll) != -1 and self.complex_name.index(num) != -1 and self.complex_name.index(sec) != -1:
                return True
        except:
            pass