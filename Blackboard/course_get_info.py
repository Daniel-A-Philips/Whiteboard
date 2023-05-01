import requests
import json
import os
from icecream import ic
class BlackboardClass():
    
    def __init__(self, item_id, class_list):
        self.item_id = item_id
        self.class_list = class_list
        self.class_number = None
        self.class_name = None
        self.all_classes = None
    
    def read_classes(self):
        __working_directory = os.getcwd()
        f = open(f'{__working_directory}/Blackboard/course_ids.json')
        self.all_classes = json.load(f)
    
    def match(self):
        possible_classes = []
        for indv_class_name in self.class_list:
            class_number_index = (list(self.all_classes.values())).index(indv_class_name)
            possible_classes.append(list(self.all_classes.keys())[class_number_index])
        
        for class_num in possible_classes:
            if self.get_assignment_page(class_num):
                print(class_num)
        
    def get_assignment_page(self, course_id):
        req = requests.get(f'https://learn.dcollege.net/webapps/assignment/uploadAssignment?course_id=_{course_id}_1&content_id=_{self.item_id}_1&group_id=&mode=view')
        print(req.url)
        if self.check_if_valid_page(req.content):
            self.class_number = course_id
            self.class_name = self.all_classes[course_id]
            return True
        return False
        
    def check_if_valid_page(self,html):
        html = str(html)
        if 'For reference, the Error ID is ' in html and 'crumb_2' in html:
            return True
        return False
    
foo = BlackboardClass(13176041,['EXAM-080-001 - SP 22-23',
                                'CS-172-065 - SP 22-23',
                                'ENGL-103-183 - SP 22-23',
                                'CI-103-060 - SP 22-23',
                                'CI-103-F - SP 22-23',
                               'CI-103-060/061/062/063/064/065-XLIST-202235'])
foo.read_classes()
foo.match()
