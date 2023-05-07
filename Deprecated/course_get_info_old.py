import requests
import json
import os
from icecream import ic
from itertools import groupby
from difflib import get_close_matches
class BlackboardClass():
    
    def __init__(self, item_id, class_list):
        self.item_id = item_id
        self.class_list = class_list
        self.class_number = None
        self.class_name = None
        self.all_classes = None
        self.read_classes()
    
    # Formats of saved data in course_ids.json:
    #   COLL: Class Type (CHEM, COM, CS, etc)
    #   NUM: Class Number (101, 102, etc)
    #   SEC: Section Number (60, 61, A, etc)
    #   QRT: Quarter Number (202225, etc)
    # Versions:
    #   1. COLL-NUM-SEC/SEC...-XLIST-QRT : PTRS-795-001/002-XLIST-201925
    #   2. 
    #       2.0 : COLL-NUM/NUM-SEC/SEC...-XLIST-QRT : FASH-433/633-001-XLIST-201925
    #       2.1 : COLLNUM-SEC/SEC...-XLIST-QRT
    #   3. COLL-NUM-SEC/COLL-NUM-SEC/...-XLIST-QRT : ARCH-T480-003/URBS-620-001/WEST-T480-003-XLIST-201925
    #   4. COLLNUM/COLLNUM-SEC-XLIST-QRT : DSMR333/FASHT580-002-XLIST-202115
    #   5. COLLNUM/NUM-SEC-XLIST-QRT : DANC205/305-001-XLIST-202145
    #   6. COLL-NUM-SEC/SEC.../COLL-NUM-SEC/SEC...-XLIST-QRT
    
    def read_classes(self):
        to_ignore = ['Migration',
                     'migration',
                     'SANDBOX',
                     'sandbox',
                     'Sandbox',
                     'REF ONLY',
                     'REFERENCE',
                     'TEST ',
                     'OLD',
                     'Old',
                     'old',
                     'Cancelled']
        to_keep = ['XLIST',
                   '/']
        __working_directory = os.getcwd()
        f = open(f'{__working_directory}/Blackboard/course_ids.json')
        self.all_classes = json.load(f)
        for key in self.all_classes.keys():
            value = self.all_classes[key]
            is_v1, is_v2, is_v3 = False, False, False
            if all(val_to_ignore not in value for val_to_ignore in to_ignore) and all(val_to_keep in value for val_to_keep in to_keep):
                #Split into possible sections
                sections = value.split('-')
                #ic(value)
                #ic(sections)
                #classes = self.format_finder(sections)
                #ic(classes)

    def find_closest_match(self, to_match):
        matches = get_close_matches(to_match, self.all_classes.values(), 5)
        ic(to_match,matches)

    def format_finder(self, sections):
        classes = []
        try:
            #sections[0] = sections[0].replace(' ','')
            version = -1
            try:
                if all( (sec.isdigit() or len(sec) < 3) for sec in sections[2].split('/')):
                    version = 1
                    classes = self.v1_format(sections)
                    #print('v1')
            finally:
                try:
                    if len(sections[1].split('/')) > 1 and version == -1 :
                        version = 2
                        classes = self.v2_format(sections)
                        #print('v2')
                finally:
                    try:
                        #COLL-NUM-SEC/COLL-NUM-SEC/...-XLIST-QRT : ARCH-T480-003/URBS-620-001/WEST-T480-003-XLIST-201925
                        if version == -1 and any(not char.isdigit() for char in sections[2].split('/')[ len(sections[2].split('/')) - 1]) and len(sections[2].split('/')[1]) != 1:
                            version = 3
                            classes = self.v3_format(sections)
                            #print('v3')
                    finally:
                        try:
                            if version == -1 and '/' in sections[0] and not sections[0].split('/')[1][0].isdigit():
                                version = 4
                                classes = self.v4_format(sections)
                        finally:
                            try:
                                if version == -1 and '/' in sections[0] and sections[0].split('/')[1][1].isdigit():
                                    version = 5
                                    classes = self.v5_format(sections)
                            finally:
                                try:
                                    if version == -1 and '/' in sections[2]:
                                        pass
                                except:
                                    raise Exception('No format found')
        except Exception as e:
            ic(version)
            print(e)
            ic('-'.join(sections))
            print('\n\n')
        #ic(classes)
        if classes == []:
            print(f'Error: {sections}')
        return classes

    def v1_format(self,sections):
        classes = []
        for sec in sections[2].split('/'):
            classes.append([sections[0],sections[1],sec,sections[len(sections) - 1]])
        return classes

    def v2_format(self, sections):
        classes = []
        # Check if the case is 2.1 rather than 2.0
        # If so, turn the 2.1 into a 2.0
        if any( char.isdigit() for char in sections[0] ):
            temp_sec_0 = [''.join(g) for _, g in groupby(sections[0], str.isalpha)]
            sections.insert(1,temp_sec_0[1])
            sections[0] = temp_sec_0[0]
        # Formatting for case 2.0
        for class_num in sections[1].split('/'):
                        classes.append([sections[0],class_num,sections[2],sections[len(sections) - 1]])
        return classes
    
    def v3_format(self, sections):
        ic(sections)
        classes = []
        num_sections = 1
        for sec in sections:
            if '/' in sec and all(not char.isdigit() for char in sec.split('/')[1]):
                num_sections += 1
        for i in range(1,2*num_sections,2):
            if i == 1:
                test_class = [sections[i-1].split('/')[0], sections[i], sections[i+1].split('/')[0],sections[len(sections)-1]]
            else:
                test_class = [sections[i-1].split('/')[1], sections[i], sections[i+1].split('/')[0],sections[len(sections)-1]]
            classes.append(test_class)
        ic(classes)
        return classes
    
    def v4_format(self, sections):
        classes = []
        temp_COLLNUM = sections[0].split('/')
        for collnum in temp_COLLNUM:
            class_list_for_v2_format = [collnum, sections[1], sections[2], sections[3]]
            classes += self.v2_format(class_list_for_v2_format)
        return classes
    
    def v5_format(self, sections):
        classes = []
        section0_temp, class_numbers  = sections[0].split('/')[0], sections[0].split('/')[1:]
        college_name, first_section = [''.join(g) for _, g in groupby(section0_temp, str.isalpha)]
        class_numbers.insert(0, first_section)
        for class_number in class_numbers:
            classes.append([college_name, class_number, sections[1], sections[3]])
        return classes
    
    def v6_format(self, sections):
        # COLL-NUM-SEC/SEC.../COLL-NUM-SEC/SEC...-XLIST-QRT
        # ['BMES', '483', '130/900/BMES', '543', '130/900', 'XLIST', '202235']
        # ['BMES', '483', '130/900/BMES', '543', '130/900']
        necessary_info = sections[0:len(sections)-2]
        ic(necessary_info)
        # number of classes in necessary_info = (length + 1) / 3
        num_classes = (len(necessary_info) + 1) / 3
        classes = []
        for i in range(1, int(num_classes)+1):
            coll = necessary_info[ (i * 2) - 2 ].split('/')[ len(necessary_info[ (i * 2) - 2 ].split('/')) - 1 ]
            num = necessary_info[ (i * 2) - 1 ]
            sec = necessary_info[ (i * 2) ].split('/')[0 : len(necessary_info[ (i * 2) ].split('/'))]
            classes.append( [coll, num, sec])
            ic([coll, num, sec])
        for j in range(len(classes)-1):
            if classes[j][2][len(classes[j][2])-1] == classes[j+1][0]:
                classes[j][2] = classes[j][2][0:len(classes[j][2])-1]
        # Currect 'classes' = [ [COLL, NUM, [SEC, SEC]], [COLL, NUM, [SEC]]] 
        # EX: [['HMP', '660', ['900', '901']], ['HMP', 'T880', ['900']]]
        returnable_classes = []
        for i in classes:
            for j in i[2]:
                returnable_classes.append([ i[0], i[1], j, sections[len(sections)-2], sections[len(sections)-1]])
        ic(classes)
        ic(returnable_classes)
        return returnable_classes
            
            
    
    def match(self):
        possible_classes = []
        for indv_class_name in self.class_list:
            class_number_index = (list(self.all_classes.values())).index(indv_class_name)
            possible_classes.append(list(self.all_classes.keys())[class_number_index])
        
        for class_num in possible_classes:
            if self.get_assignment_page(class_num):
                print('Class Found!')
                ic(self.class_number, self.class_name)

        
    def get_assignment_page(self, course_id):
        req = requests.get(f'https://learn.dcollege.net/webapps/assignment/uploadAssignment?course_id=_{course_id}_1&content_id=_{self.item_id}_1&group_id=&mode=view')
        self.class_number = course_id
        self.class_name = self.all_classes[course_id]
        if self.check_if_valid_page(req.content):
            return True
        return False
        
    def check_if_valid_page(self, html):
        html = str(html)
        # Check if child course
        if 'Unavailable child course:' in html:
            return self.get_parent_course(html)
        if 'For reference, the Error ID is ' in html and 'crumb_2' in html:
            return True
        return False

    def get_parent_course(self, html):
        link_data = (html.split('\\n')[388].strip().split('\\'))
        parent_link = link_data[5]
        if 'course_id=' in parent_link:
            course_id = parent_link.split('_')[2]
            return self.get_assignment_page(course_id)
        return False

foo = BlackboardClass(13152621,['JWST-202-900 - SP 22-23',
                                'EXAM-080-001 - SP 22-23',
                               'CS-172-065 - SP 22-23',
                                'ENGL-103-183 - SP 22-23',
                                'CI-103-060 - SP 22-23',
                             'CI-103-F - SP 22-23',
                             'CI-103-060/061/062/063/064/065-XLIST-202235'])
foo.match()

req = requests.get('https://learn.dcollege.net/webapps/assignment/uploadAssignment?course_id=_341274_1&content_id=_13152621_1&group_id=&mode=view')
#print(foo.check_if_valid_page(req.content))

if '<div id="pageTitleBar" class=\\\'pageTitleIcon\\\' tabindex="0">' in str(req.content).split('\\n'):
    pass
    
req = requests.get('https://learn.dcollege.net/webapps/assignment/uploadAssignment?course_id=_341273_1&content_id=_13152621_1&group_id=&mode=view')
#print(foo.check_if_valid_page(req.content))

split = str(req.content).split('\\n')
if '<div id="pageTitleBar" class=\\\'pageTitleIcon\\\' tabindex="0">' in split:
    line = split.index('<div id="pageTitleBar" class=\\\'pageTitleIcon\\\' tabindex="0">')
    if 'Error' in split[line + 2]:
        pass
    else:
        pass



#ic(foo.get_assignment_page(2946365))


#for c in ['EXAM-080-001 - SP 22-23',
#                                'CS-172-065 - SP 22-23',
#                                'ENGL-103-183 - SP 22-23',
#                                'CI-103-F - SP 22-23',
#                                'CI-103-060 - SP 22-23',
 #                              'CI-103-060/061/062/063/064/065-XLIST-202235']:
    #foo.find_closest_match(c)


#foo.v6_format(['HMP', '660', '900/901/HMP', 'T880', '900', 'XLIST', '202235'])

#foo.match()
