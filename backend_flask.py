from blackboard_calendar import blackboard_calendar
from tms import tms
from input_parser import input_parser
from flask import Flask, request, render_template_string, render_template, jsonify

app = Flask(__name__, template_folder='templateFiles',static_folder='staticFiles')
parser = input_parser()

@app.route('/')
def main_page():
    return render_template('index.html')

@app.route('/put-classes', methods=['POST', 'PUT','GET'])
def get_classes():
    print('put-classes')
    calendar_link = parser.blackboard_link(request.headers.get('user-blackboard-calendar-link'))
    user_copied = parser.class_information(request.headers.get('user-blackboard-copied'))    
    return calendar_link


app.run(debug=True, host='0.0.0.0', port=2000)
