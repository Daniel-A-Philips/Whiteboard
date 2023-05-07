import os

__working_directory = os.getcwd()

from Blackboard.blackboard_calendar import blackboard_calendar
from Blackboard.assignment import Assignment
from TermMaster.tms import tms
from Parser.parse import input_parser, output_parser
from flask import Flask, request, render_template_string, render_template
from icecream import ic
import json
import datetime
import copy
class_info = []
calendar_link = ''

info = ''
app = Flask(__name__, template_folder= __working_directory + '/Flask Resources/template',static_folder= __working_directory + '/Flask Resources/static')
out_parser = output_parser()
in_parser = input_parser()
termmaster = tms()
bblearn = blackboard_calendar()
assignment_info = {}

@app.route('/')
def main_page():
    return render_template('index.html')

@app.route('/put-classes', methods=['PUT'])
def put_classes():
    global class_info
    global calendar_link
    in_parser1 = input_parser()
    calendar_link = in_parser1.blackboard_link(request.headers.get('user-blackboard-calendar-link'))
    user_copied = in_parser1.class_information(request.headers.get('user-blackboard-copied'))   
    class_info = termmaster.get_all_class_info(user_copied)
    in_parser = in_parser1
    return calendar_link

@app.route('/get-classes')
def get_classes():
    global class_info
    start = datetime.datetime.now()
    parsed = out_parser.class_info_parser(class_info)
    time_taken_for_get_classes = datetime.datetime.now() - start
    ic(time_taken_for_get_classes)
    return render_template_string(json.dumps(parsed))

@app.route('/get-blackboard-calendar')
def get_blackboard_calendar():
    global calendar_link
    blackboard_calendar_info = bblearn.download_calendar(calendar_link, False)
    print(in_parser)
    classes = [f'{data["School"]}-{data["Class Number"]}-{data["Section Number"]} - {data["Quarter Name"]} {data["Year"]}' for data in in_parser.classes]
    for uid in bblearn.uids:
        ic(uid)
        ic(classes)
        temp_assignment = Assignment(uid, classes)
        assignment_info[uid] = {'Course ID':temp_assignment.course_id,
                                'Content ID': temp_assignment.content_id,
                                'Complex Name': temp_assignment.complex_name,
                                'Standard Name': temp_assignment.class_name,
                                'Discussion': temp_assignment.is_discussion_board}
    ic(assignment_info)
    return render_template_string(json.dumps( blackboard_calendar_info))

@app.route('/get-assignment-information')
def get_assignment_information():
    return render_template_string(json.dumps(assignment_info))
    
@app.route('/get-persistent-info')
def get_persistent_info():
    in_parser2 = input_parser()
    link = in_parser2.check_link_exist()
    hasClasses = in_parser2.check_classes_exist()
    ic(link)
    ic(hasClasses)
    if link and hasClasses:
        f = open(f'{__working_directory}/Information/class_info.txt')
        contents = f.read()
        ic(contents)
        classes = in_parser2.class_information(contents)
        information = termmaster.get_all_class_info(classes)
        ic(information)
        
    output = {'has_link':link,
              'has_classes':hasClasses,
              'classes': information
              }
    in_parser = in_parser2
    return render_template_string(json.dumps( output) )
    
    
app.run(debug=True, host='0.0.0.0', port=2000)
