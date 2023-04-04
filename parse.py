import urllib.parse
from icecream import ic
class input_parser:

    def __init__(self):
        print('input_parser created')
        self.classes = []
        self.link = []

    def blackboard_link(self, unparsed):
        self.link = urllib.parse.unquote(unparsed.replace('\"',''))
        return self.link

    def class_information(self, unparsed):
        all_info = urllib.parse.unquote(unparsed).split('\n')
        for line in all_info:
            if '-' in line and '.' in line and ':' in line:
                self.classes.append(line)
        ic(self.classes)
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
    
class output_parser:

    def __init__(self):
        print('output_parser created')
    
    def class_info_parser(self, class_info):
        print('Running class_info_parser')
        returnable = {}
        for individual_class in class_info:
            class_data = {}
            class_data['Days'] = self.__parse_days(individual_class)
            class_data['Time'] = individual_class['Times']
            class_data['Instructor'] = individual_class['Instructor']
            class_data['CRN'] = individual_class['CRN']
            full_class_name = individual_class['Subject Code'] + '-' + individual_class['Course No.'] + '-' + individual_class['Sec']
            returnable[full_class_name] = class_data
        return returnable

    def __parse_days(self, individual_class):
        day_list = ['M','T','W','R','F']
        days = []
        if individual_class['Days'] == 'TBD':
            return ['TBD']
        for i in individual_class['Days']:
                days.append(day_list.index(i))
        return days
    
        