import urllib.parse
from icecream import ic
import json
import os

class input_parser:
    def __init__(self):
        print('input_parser created')
        self.__working_directory = os.getcwd()
        self.classes = []
        self.link = []
        self.hasLink = False
        self.hasClass = False 
        self.hasAssignments = False
        self.hasCalendar = False

    def __write_link(self, unparsed):
        f = open(f'{self.__working_directory}/Information/link.txt','r+')
        link = f.read()
        if link == '':
            f.write(unparsed)
        f.close()
        self.hasLink = True 
    
    def __write_class_information(self, unparsed):
        f = open(f'{self.__working_directory}/Information/class_info.txt', 'r+')
        information = f.read()
        if information == '':
            f.write(unparsed)
        f.close()
        self.hasClass = True

    def check_link_exist(self):
        self.hasLink = True
        f = open(f'{self.__working_directory}/Information/link.txt','r+')
        link = f.read()
        f.close()
        if link == '':
            self.hasLink = False
        self.link = self.blackboard_link(link)
        return self.hasLink

    def check_calendar_exist(self):
        f = open(f'{self.__working_directory}/Information/calendar.json')
        data = json.load(f)
        if bool(data):
            self.hasCalendar = True
        return True

    def check_classes_exist(self):
        self.hasClass = True
        f = open(f'{self.__working_directory}/Information/class_info.txt','r+')
        classes = f.read()
        f.close()
        if classes == '':
            self.hasClass = False
        return self.hasClass

    def check_assignments_exist(self):
        self.hasAssignments = True
        f = open(f'{self.__working_directory}/Information/assignment.json')
        data = json.load(f)
        if not bool(data):
            return False, {}
        else:
            return True, data

    def blackboard_link(self, unparsed):
        ic(unparsed)
        self.__write_link(unparsed)
        self.link = urllib.parse.unquote(unparsed.replace('\"',''))
        return self.link

    def class_information(self, unparsed):
        self.__write_class_information(unparsed)
        all_info = urllib.parse.unquote(unparsed).split('\n')
        for line in all_info:
            if 'Due date:' not in line and '-' in line and '.' in line and ':' in line :
                self.classes.append(line)
        self.split_class_information()
        return self.classes

    def split_class_information(self):
        split_classes = []
        for class_info in self.classes:
            all_info = class_info.split(' ')
            split_classes.append( {
                'CRN':all_info[0].split('.')[0],
                'Quarter Number':all_info[0].split('.')[1][:-1],
                'School':all_info[1].split('-')[0],
                'Class Number':all_info[1].split('-')[1],
                'Section Number':all_info[1].split('-')[2],
                'Quarter Name' : all_info[3],
                'Year' : all_info[4]
            })
        self.classes = split_classes
    
    def get_classes(self):
        return self.classes
    
class output_parser:

    def __init__(self):
        self.__working_directory = os.getcwd()
        print('output_parser created')
    
    def class_info_parser(self, class_info, write=True):
        print('Running class_info_parser')
        returnable = {}
        ic(class_info)
        for individual_class in class_info:
            try:
                class_data = {}
                class_data['Days'] = self.__parse_days(individual_class)
                class_data['Time'] = individual_class['Times']
                class_data['Instructor'] = individual_class['Instructor']
                class_data['CRN'] = individual_class['CRN']
                full_class_name = individual_class['Subject Code'] + '-' + individual_class['Course No.'] + '-' + individual_class['Sec']
                returnable[full_class_name] = class_data
            except KeyError:
                continue
        if write:
            with open(f'{self.__working_directory}/Information/calendar.json','w+') as f:
                json.dump(returnable,f)
        return returnable

    def __parse_days(self, individual_class):
        day_list = ['M','T','W','R','F']
        days = []
        if individual_class['Days'] == 'TBD':
            return ['TBD']
        for i in individual_class['Days']:
                days.append(day_list.index(i))
        return days
    
        
