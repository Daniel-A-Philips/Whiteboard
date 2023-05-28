import os

__working_directory = os.getcwd()

from Blackboard.blackboard_calendar import blackboard_calendar
from Blackboard.assignment import Assignment
from Blackboard.async_assignment_downloader import downloader
from TermMaster.tms import tms
from Parser.parse import input_parser, output_parser
from flask import Flask, request, render_template_string, render_template
from icecream import ic
import json
import time

class_info = []
calendar_link = ''
persistent_info = {}
info = ''
app = Flask(__name__, template_folder= __working_directory + '/Flask Resources/template',static_folder= __working_directory + '/Flask Resources/static')
out_parser = output_parser()
in_parser = input_parser()
termmaster = tms()
bblearn = blackboard_calendar()
assignment_info = {}
calendar_info = {}
@app.route('/')
def main_page():
    return render_template('index.html')

@app.route('/put-classes', methods=['PUT'])
def put_classes():
    start = time.perf_counter()
    global class_info
    global calendar_link
    global in_parser
    in_parser1 = input_parser()
    calendar_link = in_parser1.blackboard_link(request.headers.get('user-blackboard-calendar-link'))
    user_copied = in_parser1.class_information(request.headers.get('user-blackboard-copied'))   
    class_info = termmaster.get_all_class_info(user_copied)
    print('Created new Input Parser for passed through information')
    in_parser = in_parser1
    time_taken = time.perf_counter() - start
    ic(time_taken)
    return calendar_link

@app.route('/get-classes')
def get_classes():
    global class_info
    parsed = out_parser.class_info_parser(class_info)
    return render_template_string(json.dumps(parsed))

@app.route('/get-blackboard-calendar')
def get_blackboard_calendar():
    global calendar_link
    global assignment_info
    global calendar_info
    calendar_info = bblearn.download_calendar(calendar_link, False, wants_uid=True)
    print(in_parser)
    classes = [f'{data["School"]}-{data["Class Number"]}-{data["Section Number"]} - {data["Quarter Name"]} {data["Year"]}' for data in in_parser.classes]
    urls = []
    for uid in bblearn.uids:
        temp_assignment = Assignment(uid, classes)
        urls.append(temp_assignment.url)
        assignment_info[uid] = {'Course ID':temp_assignment.course_id,
                                'Content ID': temp_assignment.content_id,
                                'Complex Name': temp_assignment.complex_name,
                                'Standard Name': temp_assignment.class_name,
                                'Discussion': temp_assignment.is_discussion_board}
    async_assignment = downloader(urls)
    with open(f'{__working_directory}/Information/assignment.json', "w") as outfile:
        json.dump(assignment_info, outfile)
    for key in assignment_info.keys():
        ic(assignment_info[key])
        ic(calendar_info[key])
        try:
            calendar_info[key].update(assignment_info[key])
        except:
            calendar_info[key].update(assignment_info[key][0])
    return render_template_string(json.dumps( calendar_info))

@app.route('/get-assignment-information')
def get_assignment_information():
    global assignment_info
    return render_template_string(json.dumps(assignment_info))
    
@app.route('/get-persistent-info')
def send_persistent_info():
    return render_template_string(json.dumps(persistent_info))

def check_persistence():
    global in_parser
    global class_info
    global assignment_info
    in_parser2 = input_parser()
    link = in_parser2.check_link_exist()
    hasClasses = in_parser2.check_classes_exist()
    hasCalendar = in_parser2.check_calendar_exist()
    if link and hasClasses:
        calendar = bblearn.download_calendar(in_parser2.link, False, False, True)
        f = open(f'{__working_directory}/Information/class_info.txt')
        contents = f.read()
        classes = in_parser2.class_information(contents)
        class_info = termmaster.get_all_class_info(classes)
        hasAssignment, assignment_info = in_parser2.check_assignments_exist()
        
    output = {'has_link':link,
              'has_classes':hasClasses,
              'has_assignments':hasAssignment,
              'classes': class_info,
              'assignments': assignment_info,
              "calendar":calendar
              }
    print('Created input parser for persistent data')
    in_parser = in_parser2
    return output

persistent_info = check_persistence()
ic(persistent_info)
app.run(debug=False, host='0.0.0.0', port=2000)
