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
function getCourseInfo(pasted_input){
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
  return([user_crn, course_name, course_num, course_sec])
}
// can be cut after review
fs.readFile('testInput.txt', 'utf8',(err, data) => {
  if(err){
    console.error(err)
    return
  }
  console.log(getCourseInfo(data))
})

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