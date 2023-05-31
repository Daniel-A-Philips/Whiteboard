import requests
import datetime
import csv
from ics import Calendar


# function to sort the event list by due date
def sort(event_list):
    return sorted(event_list, key=lambda x: x[1], reverse=False)


class Blackboard_Calendar:

    def __init__(self):
        print('** created Blackboard_Calendar instance **')
        self.wanted_as_table = False
        self.uids = []

    # function to parse the events into a table format
    def parse_to_table(self, events, wants_uid=False):
        event_info = []
        to_return = {}
        for event in events:
            event_array = []
            if wants_uid:
                event_array.append(event.uid)
            event_array.append(event.name)
            # convert the due date to datetime object
            due_date = datetime.datetime.strptime(str(event.begin.datetime).split(':00-')[0], "%Y-%m-%d %H:%M")
            # If the due date of the assingment is before the current date, continue onto the next assignment

            event_array.append(str(event.begin.datetime).split(':00-')[0])
            # Remove any existing html prefixes or suffixes that might exist
            description = ''.join(str(event.description).removeprefix('<p>').removesuffix('</p>'))
            # Check if there is no description, if so replace 'None' with blankspace
            if description == 'None':
                description = ''
            event_array.append(description)
            event_info.append(event_array)
            to_return[event.uid] = {
                'type': 'VEVENT',
                'start': str(event.begin),
                'end': str(event.begin),
                'uid': event.uid,
                'description': description

            }
        event_info = sort(event_info)
        return to_return
        if wants_uid:
            to_return = {}
            for event_array in event_info:
                to_return[event_array[0]] = {
                    'type': '',
                    'name': event_array[1],
                    'due date': event_array[2],
                    'description': event_array[3]
                }
        if self.wanted_as_table:
            event_info.insert(0, ['Assignment Name', 'Due Date', 'Summary'])
        return to_return

    # A function that given a .ics url downloads all events within the character
    # 'as_table' refers to whether the data should be returned raw or parsed into a table
    def download_calendar(self, url, as_table=False, wants_uid=False):
        self.wanted_as_table = as_table
        # Download the calendar from the URL
        print(url)
        r = requests.get(url)
        # Parse the calendar into an ics.Calendar object
        calendar = Calendar(r.text)
        # Convert the calendar into an array
        events = [event for event in calendar.events]
        for event in events:
            if event.uid not in self.uids:
                self.uids.append(event.uid)
        parsed = self.parse_to_table(events, wants_uid)
        return parsed

    def test(self):
        event_info = self.download_calendar(
            'https://learn.dcollege.net/webapps/calendar/calendarFeed/c2d84bf6673c402cb557f2a84ddabd87/learn.ics',
            False, True)
