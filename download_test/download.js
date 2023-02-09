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
const axios = require('axios');
const ical = require('ical');
const fs = require('fs');

// Purpose:
//  A function that takes in a .ics url, downloads it parses the information
// Inputs:
//  url : A string of the .ics url
//  saveAsJSON : A boolean value that when true saves the json as a file
// Last edited:
//  February 9th
//  Daniel Philips
async function downloadAndPrintICalendar(url, saveAsJSON) {
  console.log('--- Downloading Calendar ---')
  // Downloads the .ics data from the url
  const response = await axios.get(url);
  // Save the page data from the url as 'data'
  const data = response.data;
  // Convert the page data from the ics format into JSON
  const asJSON = ical.parseICS(data)
  // Convert the JSON object into a string while keeping formatting
  const asString = JSON.stringify(asJSON, null, '\t')
  if(saveAsJSON){
    // Inform the user that the data is being saved
    console.log('Saving Data')
    // Print formatted information
    console.log(asString)
    // Create a WriteStream object with the target file 'Calendar.json'
    var writeStream = fs.createWriteStream("Calendar.json")
    // Write the formatted json information to 'Calendar.json'
    writeStream.write(asString)
  }
}

// Tester
const url = 'https://learn.dcollege.net/webapps/calendar/calendarFeed/c2d84bf6673c402cb557f2a84ddabd87/learn.ics';
downloadAndPrintICalendar(url,true);