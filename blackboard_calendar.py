from tabulate import tabulate
import requests
import datetime
import csv
from ics import Calendar


class blackboard_calendar:

    def __init__(self):
        print('** created blackboard_calendar instance **')
        self.wanted_as_table = False

    # function to sort the event list by due date
    def sort(self, event_list):
        return sorted(event_list, key=lambda x: x[1], reverse=False)

    # function to parse the events into a table format
    def parse_to_table(self, events):
        event_info = []
        for event in events:
            event_array = []
            event_array.append(event.name)
            # convert the due date to datetime object
            due_date = datetime.datetime.strptime(str(event.begin.datetime).split(':00-')[0], "%Y-%m-%d %H:%M")
            # If the due date of the assingment is before the current date, continue onto the next assignment
            if due_date < datetime.datetime.now():
                continue
            event_array.append(str(event.begin.datetime).split(':00-')[0])
            # Remove any existing html prefixes or suffixes that might exist
            description = str(event.description).removeprefix('<p>').removesuffix('</p>')
            print(event)
            # Check if there is no description, if so replace 'None' with blankspace
            if description == 'None':
                description = ''
            event_array.append(description)
            event_info.append(event_array)
        event_info = self.sort(event_info)
        if self.wanted_as_table:
            event_info.insert(0,['Assignment Name','Due Date','Summary'])
        return event_info

    # A function that given a .ics url downloads all events within the character
    # 'as_table' refers to whether the data should be returned raw or parsed into a table
    def download_calendar(self, url, as_table):
        self.wanted_as_table = as_table
        # Download the calendar from the URL
        r = requests.get(url)
        # Parse the calendar into an ics.Calendar object
        calendar = Calendar(r.text)
        # Convert the calendar into an array
        events = [event for event in calendar.events]
        return self.parse_to_table(events)

    def pretty_print(self, data):
        return tabulate(data,headers='firstrow',tablefmt='fancy_grid')

    def test(self):
        event_info = self.download_calendar('https://learn.dcollege.net/webapps/calendar/calendarFeed/c2d84bf6673c402cb557f2a84ddabd87/learn.ics',False)
        print(event_info)
