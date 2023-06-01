import os
import json
from Blackboard.blackboard_calendar import Blackboard_Calendar
from Blackboard.assignment import Assignment
from Blackboard.async_assignment_downloader import Downloader
from TermMaster.tms import TMS
from Parser.parse import Input_Parser, Output_Parser
from flask import Flask, request, render_template_string, render_template

__working_directory = os.getcwd()
class_info = []
calendar_link = ''
info = ''
app = Flask(__name__,
            template_folder=__working_directory + '/Flask Resources/template',
            static_folder=__working_directory + '/Flask Resources/static')
out_parser = Output_Parser()
in_parser = Input_Parser()
termmaster = TMS()
BBLearn = Blackboard_Calendar()
assignment_info = {}
calendar_info = {}


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/put-classes', methods=['PUT'])
def put_classes():
    global in_parser
    global class_info
    global calendar_link
    global in_parser
    in_parser1 = Input_Parser()
    calendar_link = in_parser1.blackboard_link(request.headers.get('user-blackboard-calendar-link'))
    user_copied = in_parser1.class_information(request.headers.get('user-blackboard-copied'))
    class_info = termmaster.get_all_class_info(user_copied)
    print('Created new Input Parser for passed through information')
    in_parser = in_parser1
    return calendar_link


@app.route('/get-classes')
def get_classes():
    global class_info
    global out_parser
    parsed = out_parser.class_info_parser(class_info)
    return render_template_string(json.dumps(parsed))


@app.route('/get-blackboard-calendar')
def get_blackboard_calendar():
    global calendar_link
    global assignment_info
    global calendar_info
    global in_parser
    calendar_info = BBLearn.download_calendar(calendar_link, wants_uid=True)
    classes = [
        f'{data["School"]}-{data["Class Number"]}-{data["Section Number"]} - {data["Quarter Name"]} {data["Year"]}' for
        data in in_parser.classes]
    assignments = [Assignment(uid, classes) for uid in BBLearn.uids]
    async_assignment = Downloader(assignments).url_match_assignment
    for uid in async_assignment.keys():
        temp_assignment = async_assignment[uid]
        assignment_info[uid.split('/')[7].split('_')[2]] = {'Course ID': temp_assignment.course_id,
                                                            'Content ID': temp_assignment.content_id,
                                                            'Complex Name': temp_assignment.complex_name,
                                                            'Standard Name': temp_assignment.class_name,
                                                            'Discussion': temp_assignment.is_discussion_board}

    with open(f'{__working_directory}/Information/assignment.json', "w") as outfile:
        json.dump(assignment_info, outfile)
    return render_template_string(json.dumps(calendar_info))


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
    global calendar_link
    in_parser2 = Input_Parser()
    link = in_parser2.check_link_exist()
    has_classes = in_parser2.check_classes_exist()
    has_calendar = in_parser2.check_calendar_exist()
    has_assignment = False
    calendar = []
    if link and has_classes:
        calendar = BBLearn.download_calendar(in_parser2.link, wants_uid=True)
        f = open(f'{__working_directory}/Information/class_info.txt')
        contents = f.read()
        classes = in_parser2.class_information(contents)
        class_info = termmaster.get_all_class_info(classes)
        has_assignment, assignment_info = in_parser2.check_assignments_exist()

    output = {'has_link': link,
              'has_classes': has_classes,
              'has_assignments': has_assignment,
              'has_calendar': has_calendar,
              'classes': class_info,
              'assignments': assignment_info,
              "calendar": calendar
              }
    print('Created input parser for persistent data')
    in_parser = in_parser2
    return output


persistent_info = check_persistence()
app.run(debug=False, host='0.0.0.0', port=2000)
