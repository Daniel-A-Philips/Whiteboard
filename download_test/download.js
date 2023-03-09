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

blackboard_calendar()

get_test_data().then( data => {
  console.log('get_test_data():')
  console.log(data)
  console.log('data[1]')
  console.log(data[1])
  test_data = data[1]
  for(var i = 0; i < data[1].length; i++){
    var call = new TMS_Parser(data[0][i],data[1][i],data[4])
  }
  app.listen(2000)
})

//////////////////////////////////////////////////////////////////////////////////////////
function fetcher(jsessionid,crn,quarter){
  fetch("https://termmasterschedule.drexel.edu/webtms_du/searchCourses", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": `JSESSIONID=${jsessionid}; nmstat=9945ca32-b50b-46e7-49ff-efb7cb14d8c2; __qca=P0-1034030140-1663551930290; _ga_CZV0Y1WRHC=GS1.1.1664813594.2.0.1664813594.0.0.0; _tt_enable_cookie=1; _ttp=c736788b-799a-4af6-aa32-d7f86662f599; _hjSessionUser_864760=eyJpZCI6Ijc2MGJjMTJjLTkwNmYtNTY0Zi1iZWJiLTJjMGZjNjZlNGZiMSIsImNyZWF0ZWQiOjE2NjczMjcwMTgxMzEsImV4aXN0aW5nIjpmYWxzZX0=; _ga_4819PJ6HEN=GS1.1.1667327018.1.1.1667328377.0.0.0; _ga_0HYE8YG0M6=GS1.1.1667327018.1.1.1667328377.0.0.0; _hjSessionUser_1459581=eyJpZCI6ImE3M2Y3NWRiLWM4YjgtNTM2Yi1iNGJmLWM0Y2Q0ZDMxZDQ5NyIsImNyZWF0ZWQiOjE2NjczMjcyNTUxODYsImV4aXN0aW5nIjp0cnVlfQ==; _hjSessionUser_855069=eyJpZCI6IjVkOGJlYjcxLWU0Y2YtNTQyNi05ZWVkLWEwN2Q2NzE3MmZlMiIsImNyZWF0ZWQiOjE2NjM1NTE5MzAzMjAsImV4aXN0aW5nIjp0cnVlfQ==; _ga_FW9F4MBGFT=GS1.1.1669832624.1.0.1669832624.0.0.0; _ga_NMQ7G9RCBP=GS1.1.1669832624.1.0.1669832624.0.0.0; _ga_PQ370BZJFT=GS1.1.1675736214.5.0.1675736235.0.0.0; _gcl_au=1.1.96399806.1676390314; _ga_6VXTC1Y945=GS1.1.1676419147.2.1.1676419369.0.0.0; sc_is_visitor_unique=rx7676330.1677014066.20AC392C3C6C4FFAF63AE8824B3E4CD9.1.1.1.1.1.1.1.1.1-10834203.1676855188.1.1.1.1.1.1.1.1.1-6868626.1676854931.2.2.2.2.2.2.2.2.2; IDMSESSID=F9FDE62834F5136AC1C8677B87CB1EBE3750A4AC8B9C3C10E131818BF97942AA4C60E4EF9C61A28D026F9BC8727432FE; _uetvid=be8234a037bc11edbb8af3ab82e91766; iv=69aa3904-360b-44e7-a623-773cd32a0191; _clck=ewvudy|1|f9p|0; _ga=GA1.2.410723813.1660586547; _ga_H9NXSPBKEB=GS1.1.1678216944.1.0.1678216944.0.0.0; _ga_6KJ1PNLE19=GS1.1.1678216922.110.1.1678216944.38.0.0; _ga_2PPGKTTDCQ=GS1.1.1678216922.15.1.1678216944.0.0.0`,
    "Referer": "https://termmasterschedule.drexel.edu/webtms_du/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": `term.termDesc=${quarter}&crseTitle=&crseNumb=&crn=${crn}&campus.desc=Any`,
  "method": "POST"
}).then(function (response) {
	// The API call was successful!
	return response.text();
}).then(function (html) {
	// This is the HTML from our response as a text string
	console.log(crn,':',TMS_HTML_CLASS_PARSER(html,crn));
}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});
}

function TMS_HTML_CLASS_PARSER(html, crn){
  html = html.split('\n')
  var i = 0
  var times = []
  html.forEach(line => {
    if(line.includes('table-day-time') ){
      times[0] = html[i+3].split('>')[1].split('<')[0]
      times[1] = html[i+4].split('>')[1].split('<')[0]
      return times
    }
    i++
  })
  if(times == []){
    console.err('Warning: No Times and Dates Found in the following HTML!')
    console.log(html)
  }
  return times
}
//////////////////////////////////////////////////////////////////////////////////////////

function TMS_Parser(crn, school, quarterNumber){
  //console.log(`crn: ${crn}, school: ${school}, quarterNumber: ${quarterNumber}`)
  getTermIDS().then( output => {
    output.forEach( quarterInfo =>{
      if(quarterInfo[1].includes(quarterNumber)){
        fetcher(quarterInfo[1].split(';')[1].split('=')[1].split('?')[0],crn,quarterInfo[0].replace(' ','+'))
      }
    })
  })

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