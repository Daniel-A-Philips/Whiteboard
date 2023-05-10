import os
import json
from icecream import ic
import requests
from difflib import get_close_matches

class Assignment:
    
    def __init__(self, item_id, classes):
        self.item_id = item_id
        self.classes = classes
        self.course_id = ''
        self.content_id = ''
        self.class_name = ''
        self.complex_name = ''
        self.is_discussion_board = True
        self.__working_directory = os.getcwd()
        self.get_ids()
        if self.course_id == '':
            return
        self.get_class_name()
    
    def get_ids(self):
        with open(f'{self.__working_directory}/Blackboard/assignment_headers.json','r+') as file:
            headers = json.load(file)['headers']
        url = f'https://learn.dcollege.net/webapps/calendar/launch/attempt/_blackboard.platform.gradebook2.GradableItem-_{self.item_id}_1'
        req = requests.get(url, headers=headers)
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
                ic(self.course_id, self.content_id)
                break
    
    def get_class_name(self):
        try:
            with open(f'{self.__working_directory}/Blackboard/course_ids.json', 'r+') as file:
                all_classes = json.load(file)
                self.complex_name = all_classes[self.course_id]
                is_xlist = 'XLIST' in self.complex_name
                file.close()
            if is_xlist:
                #TODO
                matches = get_close_matches(self.complex_name, self.classes, cutoff=0.3)
                self.class_name = matches[0]
            else:
                self.class_name = self.complex_name
            ic(self.class_name, self.course_id, self.content_id)
        except:
            print('Error in get_class_name')
            