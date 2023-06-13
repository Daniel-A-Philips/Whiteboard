import os
import json
import time
from difflib import get_close_matches


class Assignment:

    def __init__(self, item_id, classes):
        working_directory = os.path.join(os.getcwd(), 'Blackboard')
        self.__cookie_file = os.path.join(working_directory, 'assignment_headers.json')
        self.__course_id_file = os.path.join(working_directory, 'course_ids.json')
        self.headers = []
        self.url = ''
        self.item_id = item_id.split('_')[2]
        self.classes = classes
        self.course_id = ''
        self.content_id = ''
        self.class_name = ''
        self.complex_name = ''
        self.__data = None
        self.is_discussion_board = False

    def make_url(self):
        with open(self.__cookie_file, 'r') as file:
            self.headers = json.load(file)['headers']
        self.url = f'https://learn.dcollege.net/webapps/calendar/launch/attempt/_blackboard.platform.gradebook2' \
                   f'.GradableItem-_{self.item_id}_1'
        return self.url

    def check_cookies_last_edited(self):
        if os.path.exists(self.__cookie_file):
            file_stat = os.stat(self.__cookie_file)
            return time.time() - file_stat.st_mtime
        else:
            return None

    def cookie_validation(self):
        last_edit_time = self.check_cookies_last_edited()
        if last_edit_time is not None:
            return last_edit_time <= 4 * 60 * 60
        else:
            return False

    def get_ids(self, lines):
        self.__data = lines
        if not self.cookie_validation():
            raise Exception(f'Please renew your cookies held within {self.__cookie_file}')
        for line in lines:
            self.is_discussion_board = 'discussion_board_entry' in line
            if 'breadcrumbs.rightMostParentURL' in line:
                data = line.split('\'')[1].split('?')[1].split('&')
                if len(data) == 1:
                    self.course_id = data[0].split('=')[1].split('_')[1]
                    break
                if not self.is_discussion_board:
                    self.course_id = data[0].split('=')[1].split('_')[1]
                    self.content_id = data[1].split('=')[1]
                else:
                    self.course_id = data[2].split('=')[1].split('_')[1]
                break

    def get_class_name(self, all_classes=None):
        if self.class_name != '':
            self.complex_name = self.class_name
            return
        if all_classes is None:
            with open(self.__course_id_file, 'r+') as file:
                all_classes = json.load(file)
                self.complex_name = all_classes.get(self.course_id, 'No Name Found')
                self.class_name = self.complex_name
                if self.complex_name == 'No Name Found':
                    return
        else:
            self.complex_name = all_classes.get(self.course_id, 'No Name Found')
            self.class_name = self.complex_name
            if self.complex_name == 'No Name Found':
                self.complex_name = self.no_name_check()
                self.class_name = self.complex_name
                return
        if 'XLIST' in self.complex_name:
            matches = get_close_matches(self.complex_name, self.classes, cutoff=0.3)
            self.class_name = matches[0]
        self.class_name = ''.join(self.class_name)

    def no_name_check(self):
        for line in self.__data:
            if '&ndash;' in line:
                return line.split('&ndash; ')[1].split('<')[0]