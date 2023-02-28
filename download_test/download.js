//  File Name: 
//      download.js
//  Created by Daniel Philips and Daniel Rochon
//  Last edited:
//      Daniel Philips
//      9th February 2023
//  Purpose:
//      This code downloads the users url and parses the 
//      data into a usable format for the frontend design

// Required imports
const axios = require('axios')
const ical = require('ical')
const fs = require('fs')
const { Parser } = require('@json2csv/plainjs')
const express = require('express')
const { getCipherInfo } = require('crypto')

// Purpose:
//  A function that takes in a .ics url, downloads it parses the information
// Inputs:
//  url : A string of the .ics url
//  saveAsJSON : A boolean value that when true saves the json as a file
// Last edited:
//  February 9th
//  Daniel Philips
async function downloadAndPrintICalendar(url, saveAsJSON, makeReadable, returnable, printInfo) {
  console.log('--- Downloading Calendar ---')
  // Downloads the .ics data from the url
  const response = await axios.get(url)
  // Save the page data from the url as 'data'
  const data = response.data
  // Convert the page data from the ics format into JSON
  const asJSON = ical.parseICS(data)
  // Convert the JSON object into a string while keeping formatting
  const asString = JSON.stringify(asJSON, null, '\t')
  if(saveAsJSON){
    // Inform the user that the data is being saved
    console.log('Saving Data')
    // Print formatted information
    if(printInfo){
      //console.log(asString)
      console.log('')
    }
    // Create a WriteStream object with the target file 'Calendar.json'
    const writeStream = fs.createWriteStream("Calendar.json")
    // Write the formatted json information to 'Calendar.json'
    writeStream.write(asString)
  }
  if(makeReadable){
    readableOutput(asJSON)
  }
  if(returnable){
    return asJSON
  }
}

// Given some array it will split the array into smaller arrays of some specified size
function chunkArrayInGroups(arr, size) {
  let newArr = [];
  for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
  }
  console.log(newArr)
  return newArr;
}
// Purpose: 
//  Takes json and converts it to csv
// Last edited: 
//  February 13th 
//  Daniel Rochon
async function readableOutput(json){
    const parser = new Parser({delimiter: '},'})
    const csv = parser.parse(json)
    //console.log(csv)
    const writeStream = fs.createWriteStream("Readable.csv")

    // writeStream.write(csv)

    //defines the header for the target csv file 
    const keys = ['type', 'params', 'dtstamp', 'start', 'end', 'summary', 'uid', 'description']
    //ignores first json object and puts the assignments into an array
    let relevant_json = []
    for(const i in json){
        relevant_json.push(i)
    }
    relevant_json.shift()
    // creates body array for csv file 
    let content = []
    // Getting the actual properties (type, params, dtstamp, ...) for each assignment then putting them in some array
    for(element in relevant_json){
        for(const key in keys){
            content.push((json[relevant_json[element]][keys[key]]))
        }
    }
    let csvData = 'type, params, dtstamp, start, end, summary, uid, description\n'
    // splits content into smaller arrays of size 8. 
    const new_content = chunkArrayInGroups(content,keys.length)
    // takes the content and formats contents of inner-array so that they're 
    // separated by a comma and a new line is placed between each array
    csvData += new_content.map(function(d){
      return d.join()
    }).join('\n')
    //console.log(csvData)
    writeStream.write(csvData)
}
// Purpose:
//  Takes copied and pasted user input, and gets CRN's, course names, course numbers, and course sections out of it. 
// Last Edited:
//  February 28th
//  Daniel Rochon 
async function getCourseInfo(pasted_input){
  let lines = pasted_input.split('\n')
  let user_crn = []
  let info = []
  let course_name = []
  let course_num = []
  let course_sec = []
  lines.map(line => {
    if(line.includes('WI 22-23')){
      user_crn.push(line.substring(0,5))
      info.push(line.split(' ')[1])
    }
  })
  for(let k = 0; k < user_crn.length; k++){
    for(let i = 0; i < 3; i++){
      if (i == 0){
        course_name.push(info[k].split('-')[i])
      }
      else if (i == 1){
        course_num.push(info[k].split('-')[i])
      }
      else{
        course_sec.push(info[k].split('-')[i])
      }
    }
  }
  //cut after review 
  console.log([user_crn, course_name, course_num, course_sec])
  return([user_crn, course_name, course_num, course_sec])
}
// can be cut after review
getCourseInfo(`Skip to main content
Drexel University
Institution Page
Daniel Rochon
Activity Stream
Courses
Calendar
Messages
Grades
Tools
Sign Out
Privacy
Terms
Calendar

Feb 2023
Previous Week
SSSMMMTTTWWWTTTFFFSSS
26
27281234
0 scheduled items3 or more scheduled items1 scheduled item1 scheduled item0 scheduled items1 scheduled item0 scheduled itemsNext Week
February 26, 2023
12 AM	
1 AM	
2 AM	
3 AM	
4 AM	
5 AM	
6 AM	
7 AM	
8 AM	
9 AM	
10 AM	
11 AM	
12 PM	
1 PM	
2 PM	
3 PM	
4 PM	
5 PM	
6 PM	
7 PM	
8 PM	
9 PM	
10 PM	
11 PM	
1:06 PM
Calendar Settings
Select the calendars you want to display:

Calendars
Clear All
Select All
My Personal Calendar
20194.202225: EXAM-080-001 - WI 22-23
20200.202225: CHEM-103-A - WI 22-23
21169.202225: CI-102-060 - WI 22-23
21175.202225: CI-102-A - WI 22-23
21575.202225: MATH-200-A - WI 22-23
21915.202225: CHEM-103-065 - WI 22-23
22041.202225: CS-171-064 - WI 22-23
22044.202225: CS-171-B - WI 22-23
22639.202225: MATH-200-007 - WI 22-23
22853.202225: COOP-101-017 - WI 22-23
24185.202225: ENGL-102-006 - WI 22-23
25850.202225: CHEM-103-005 - WI 22-23
SCI_CCI-Self-Srvc-Advsng_mjg88: Advising for CCI
Institution
×`)

// Tester
const url = 'https://learn.dcollege.net/webapps/calendar/calendarFeed/c2d84bf6673c402cb557f2a84ddabd87/learn.ics'

//downloadAndPrintICalendar(url,true, true, false,false)

const app = express()

async function blackboard_calendar(){
  const calendarJSON = await downloadAndPrintICalendar(url,false, false, true,false)
  app.get('/blackboard-calendar', (req,res) => {
    console.log('blackboard-calendar')
    console.log(calendarJSON)
    res.send(calendarJSON)
    //res.json({test:'a'})
  })
}

blackboard_calendar()

app.listen('2000')