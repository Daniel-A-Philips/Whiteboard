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
    if(line.includes('.') && line.includes(': ') && line.includes(' - ')){
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
  return [user_crn, course_name, course_num, course_sec]
}

// Purpose:
//  A function that parses the test data
// Inputs:
//  NONE
// Last edited:
//  March 2nd 2023
//  Daniel Philips
// Created by Daniel Rochon
async function get_test_data(){
  try{
    const data = await fs.promises.readFile("testInput.txt","utf-8")
    return getCourseInfo(data)
  } catch (err) {
    console.log(err)
    return err
  }
}

// Tester
const url = 'https://learn.dcollege.net/webapps/calendar/calendarFeed/c2d84bf6673c402cb557f2a84ddabd87/learn.ics'

//downloadAndPrintICalendar(url,true, true, false,false)

const app = express()


// Purpose:
//  A function that runs and downloads the blackboard calendar
// Inputs:
//  NONE
// Last edited:
//  March 2nd 2023
//  Daniel Philips
async function blackboard_calendar(){
  const calendarJSON = await downloadAndPrintICalendar(url,false, false, true,false)
  app.get('/blackboard-calendar/', (req,res) => {
    console.log('blackboard-calendar')
    console.log(calendarJSON)
    res.send(calendarJSON)
    //res.json({test:'a'})
  })
}

async function downloadFromCRN(crn_array){
  console.log(crn_array)
  crn_array.forEach(downloadCourseInformation)
}

async function downloadCourseInformation(crn){
  const url = `https://termmasterschedule.drexel.edu/webtms_du/courseList/${crn}`
  const response = await axios.get(url)
  console.log(url)
  // Save the page data from the url as 'data'
  const data = response.data
  fs.writeFile(`./tmtest${crn}.html`,data, err => {
    if (err) {
      console.error(err)
    }
  })
}

// Purpose:
//  A helper function that returns true when the desired line is passed through
// Inputs:
//  line : A string of a line of HTML
// Output:
//  Returns true if the desired text is within the line, otherwise returns false
// Last edited:
//  March 6th 2023
//  Daniel Philips
function filterHTML(line){
  if(line.includes('class=\"term\"')){
    return true
  }
  else return false
}

// Purpose:
//  A function that grabs and parses the body of the TMS homepage,
//  Finding the term numbers and hyperlinks
// Inputs:
//  NONE
// Output:
//  Returns a parsed list of terms in the following format
//    [
//    [Quarter Title (eg Spring Semester 21-22),
//     Hyperlink (eg /webtms_du/collegesSubjects/202141;jsessionid=A54F835C01E448B62F3C93D8B2ECAAC0?collCode=)
//     ]
//    ]
// Last edited:
//  March 6th 2023
//  Daniel Philips
async function getTermIDS(){
  console.log('Starting getTermIDS')
  let terms_raw = []
  var url = 'http://termmasterschedule.drexel.edu'
  // Download the hompeage of TMS and get the body, splitting to an array
  const bodyAsArray = (await axios.get(url)).data.split('\n')
  // Filter out all lines that don't contain a term link
  terms_raw = bodyAsArray.filter(filterHTML)
  var terms = []
  terms_raw.forEach( raw => {
    var temp = raw.split('>').slice(2,4)
    // Clean up HTML Code to make readable
    temp[0] = temp[0].substring('&nbsp;&nbsp;<a href="'.length)
    temp[0] = temp[0].substring(0,temp[0].length - 2)
    temp[1] = temp[1].substring(0,temp[1].indexOf('<'))

    // Switch the order of the link and the title
    var temp1 = temp[0]
    temp[0] = temp[1]
    temp[1] = temp1
    terms.push(temp)
  })
  return terms
}

blackboard_calendar()
get_test_data().then( data => {
  console.log('get_test_data():')
  console.log(data)
  console.log('data[2]')
  console.log(data[1])
  test_data = data[1]
  //downloadFromCRN(test_data)
  getTermIDS().then( output => {
    console.log(output)
  })
  app.listen(2000)
})


