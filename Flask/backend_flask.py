import sys
import os

__working_directory = os.getcwd()

for directory in ['Blackboard', 'Parser','TermMaster']:
    print(__working_directory + '/' + directory)
    sys.path.insert(1, __working_directory + '/' + directory)
    
from blackboard_calendar import blackboard_calendar
from tms import tms
from parse import input_parser, output_parser
from flask import Flask, request, render_template_string, render_template
from icecream import ic
import json
import datetime
class_info = []
calendar_link = ''

info = ''
app = Flask(__name__, template_folder= __working_directory + '/Flask Resources/template',static_folder= __working_directory + '/Flask Resources/static')
output_parser = output_parser()
termmaster = tms()
bblearn = blackboard_calendar()


@app.route('/')
def main_page():
    return render_template('index.html')

@app.route('/put-classes', methods=['PUT'])
def put_classes():
    global class_info
    global calendar_link
    input_parser1 = input_parser()
    start = datetime.datetime.now()
    calendar_link = input_parser1.blackboard_link(request.headers.get('user-blackboard-calendar-link'))
    user_copied = input_parser1.class_information(request.headers.get('user-blackboard-copied'))   
    class_info = termmaster.get_all_class_info(user_copied)
    time_taken_for_put_classes = datetime.datetime.now() - start
    ic(time_taken_for_put_classes)
    return calendar_link

@app.route('/get-classes')
def get_classes():
    global class_info
    start = datetime.datetime.now()
    parsed = output_parser.class_info_parser(class_info)
    time_taken_for_get_classes = datetime.datetime.now() - start
    ic(time_taken_for_get_classes)
    return render_template_string(json.dumps(parsed))

@app.route('/get-blackboard-calendar')
def get_blackboard_calendar():
    global calendar_link
    start = datetime.datetime.now()
    blackboard_calendar_info = bblearn.download_calendar(calendar_link, False)
    time_taken_for_get_blackboard_calendar = datetime.datetime.now() - start
    ic(time_taken_for_get_blackboard_calendar)
    return render_template_string(json.dumps( blackboard_calendar_info))

@app.route('/get-persistent-info')
def get_persistent_info():
    input_parser2 = input_parser()
    link = input_parser2.check_link_exist()
    hasClasses = input_parser2.check_classes_exist()
    ic(link)
    ic(hasClasses)
    if link and hasClasses:
        f = open(f'{__working_directory}/Information/class_info.txt')
        contents = f.read()
        ic(contents)
        classes = input_parser2.class_information(contents)
        information = termmaster.get_all_class_info(classes)
        ic(information)
        
    output = {'has_link':link,
              'has_classes':hasClasses,
              'classes': information
              }
    return render_template_string(json.dumps( output) )
    
    
app.run(debug=True, host='0.0.0.0', port=2000)
