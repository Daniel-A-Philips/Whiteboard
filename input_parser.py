import urllib.parse

class input_parser:

    def __init__(self):
        print('parser_created')
        self.classes = []
        self.link = []

    def blackboard_link(self, unparsed):
        self.link = urllib.parse.unquote(unparsed.replace('\"',''))
        print(self.link)
        return self.link

    def class_information(self, unparsed):
        all_info = urllib.parse.unquote(unparsed).split('\n')
        for line in all_info:
            if '-' in line and '.' in line and ':' in line:
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
        print(split_classes)