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

let JSON_TO_SEND= '{'
<<<<<<< HEAD:download.js
=======
let TMS_Link = ''
>>>>>>> Python-Backend:Deprecated/download.js

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
  //console.log(pasted_input)
  pasted_input = pasted_input.toString()
  let lines = pasted_input.split('\n')
  let user_crn = []
  let info = []
  let course_name = []
  let course_num = []
  let course_sec = []
  let quarter_number = -1
  lines.map(line => {
    if(line.includes('.') && line.includes(': ') && line.includes(' - ')){
      user_crn.push(line.substring(0,5))
      quarter_number = line.substring(6,12)
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
  return [user_crn, course_name, course_num, course_sec, quarter_number]
}

// Purpose:
//  A function that parses the test data
// Inputs:
//  NONE
// Last edited:
//  March 2nd 2023
//  Daniel Philips
// Created by Daniel Rochon
async function get_test_data(data){
  try{
    return getCourseInfo(data)
  } catch (err) {
    console.log(err)
    return err
  }
}

const app = express()
const fileTypes = ['html','js','css']
fileTypes.forEach(fileType => {
  app.get(`/index.${fileType}`, (req, res) => {
    try{
      res.sendFile(__dirname + `/public/index.${fileType}`)
      console.log(`sent index.${fileType}`)
    }catch(err){
      console.log(err)
    }
  })
})

// Program to be run when data is sent from the frontend to the backend
app.put('/put-classes', (req,res) =>{
  let class_info = decodeURIComponent(req.headers['user-blackboard-copied'])
  TMS_Link = decodeURIComponent(req.headers['user-blackboard-calendar-link']).toString().replaceAll('"','')
  console.log(TMS_Link)
  blackboard_calendar(TMS_Link)
  get_test_data(class_info).then( foo => {
    for(var i = 0; i < foo[1].length; i++){
      var call = helper(foo[0][i],foo[1][i],foo[4])
    }
  }).then(write_get_classes)
  
})

// Purpose:
//  A function that runs and downloads the blackboard calendar
// Inputs:
//  NONE
// Last edited:
//  March 2nd 2023
//  Daniel Philips
async function blackboard_calendar(tmsurl){
  console.log('Running blackboard_calendar')
  const calendarJSON = await downloadAndPrintICalendar(tmsurl,false, false, true,false)
  app.get('/get-blackboard-calendar', (req,res) => {
    console.log('blackboard-calendar')
    res.send(calendarJSON)
  })
}

async function write_get_classes(){
  console.log('Running write_get_classes')
  app.get('/get-classes',(req,res) => {
    JSON_TO_SEND = JSON_TO_SEND.slice(0,JSON_TO_SEND.length-1) + '}'
    res.send(JSON_TO_SEND)
  })
}

async function helper(a,b,c){
  return await TMS_Parser(a,b,c)
}


app.listen(2000)


//////////////////////////////////////////////////////////////////////////////////////////

function sendAllClasses(class_jsons){
  var toSend = '{\n' + class_jsons + '}'
}


async function fetcher(jsessionid,crn,quarter){
  console.log('quarter:',quarter)
  let headers = require('./TMS_Headers.json')['headers']
  headers['cookie'] = headers['cookie'].replace('${jsessionid}',jsessionid)
  fetch("https://termmasterschedule.drexel.edu/webtms_du/searchCourses", {  
  headers,
  "body": `term.termDesc=${quarter}&crseTitle=&crseNumb=&crn=${crn}&campus.desc=Any`,
  "method": "POST"  }).then(function (response) {
  console.log(`term.termDesc=${quarter}&crseTitle=&crseNumb=&crn=${crn}&campus.desc=Any`,)
	// The API call was successful!
	return response.text();
}).then(function (html) {
	// This is the HTML from our response as a text string
var data = TMS_HTML_CLASS_PARSER(html,crn)
console.log(data)
  return class_to_json(data[1][2],data[0][0],data[0][1],data[1][3],crn,data[1][0])
}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});
}

function TMS_HTML_CLASS_PARSER(html, crn){
  //Split the given HTML into individual lines for parsing
  html = html.split('\n')

  var line_num = 0
  var times = []
  // Represents the 4 other pieces of information that need to be held
  var info4 = []
  html.forEach(line => {
    if(line.includes('table-day-time') ){
      times[0] = html[line_num+3].split('>')[1].split('<')[0]
      times[1] = html[line_num+4].split('>')[1].split('<')[0]
      return
    }
    if(line.includes('<td align=\"left\" valign=\"top\">') || line.includes('<td align=\"left\" valign=\"center\">')){
      info4.push(line.split('>')[1].split('<')[0])
    }
    line_num++
  })
  if(times == []){
    console.err('Warning: No Times and Dates Found in the following HTML!')
    console.log(html)
  }
  return [times,info4]
}
//////////////////////////////////////////////////////////////////////////////////////////

async function TMS_Parser(crn, quarterNumber){
  getTermIDS().then( output => {
    output.forEach( quarterInfo =>{
      console.log('quarterInfo:', quarterInfo)
      if(quarterInfo[1].includes(quarterNumber)){
        console.log(quarterInfo[0].replace(' ','+'))
        return fetcher(quarterInfo[1].split(';')[1].split('=')[1].split('?')[0],crn,quarterInfo[0].replace(' ','+'))
      }
    })
  })

}

//////////////////////////////////////////////////////////////////////////////////////////

function class_to_json(name, days, times, instructor, crn,type){
  var parsed_times = []
  var daylist = ['M','T','W','R','F']
  try{
    days = days.split('')
  } catch(error){
    console.error('No Class Information or Error with class information')
    return ''
  }
  days.forEach(day => {
    parsed_times.push(daylist.indexOf(day))
  })
  let text = `\"${name} - ${type}\": {\n\"days\": \"${parsed_times}\",\n\"time\": \"${times}\",\n\"instructor\": \"${instructor}\",\n\"crn\": \"${crn}\"},` 
  JSON_TO_SEND = JSON_TO_SEND.concat(text)
  return text
}

//////////////////////////////////////////////////////////////////////////////////////////
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