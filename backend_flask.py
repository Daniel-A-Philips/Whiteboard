from blackboard_calendar import blackboard_calendar
from tms import tms
from parse import input_parser, output_parser
from flask import Flask, request, render_template_string, render_template, jsonify
from icecream import ic
import json
import datetime

class_info = []
calendar_link = ''

info = ''
app = Flask(__name__, template_folder='template',static_folder='static')
in_parse = input_parser()
out_parse = output_parser()
termmaster = tms()
bblearn = blackboard_calendar()


@app.route('/')
def main_page():
    return render_template('index.html')

@app.route('/put-classes', methods=['PUT'])
def put_classes():
    start = datetime.datetime.now()
    global class_info
    global calendar_link
    calendar_link = in_parse.blackboard_link(request.headers.get('user-blackboard-calendar-link'))
    user_copied = in_parse.class_information(request.headers.get('user-blackboard-copied'))    
    class_info = termmaster.get_all_class_info(user_copied)
    time_taken_for_put_classes = datetime.datetime.now() - start
    ic(time_taken_for_put_classes)
    return calendar_link

@app.route('/get-classes')
def get_classes():
    start = datetime.datetime.now()
    global class_info
    parsed = out_parse.class_info_parser(class_info)
    time_taken_for_get_classes = datetime.datetime.now() - start
    ic(time_taken_for_get_classes)
    return render_template_string(json.dumps(parsed))

@app.route('/get-blackboard-calendar')
def get_blackboard_calendar():
    start = datetime.datetime.now()
    global calendar_link
    blackboard_calendar_info = bblearn.download_calendar(calendar_link, False)
    time_taken_for_get_blackboard_calendar = datetime.datetime.now() - start
    ic(time_taken_for_get_blackboard_calendar)
    return render_template_string(json.dumps( blackboard_calendar_info))

app.run(debug=True, host='0.0.0.0', port=2000)
