const axios = require('axios');
const ics = require('ics');

async function downloadAndPrintICalendar(url) {
  const response = await axios.get(url);
  const data = response.data;
  console.log(data)
  ics.parseICS(data, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      data.events.forEach(event => {
        console.log('Event:');
        console.log('Start:', event.start);
        console.log('End:', event.end);
        console.log('Summary:', event.summary);
        console.log('Description:', event.description);
        console.log('Location:', event.location);
        console.log('');
      });
    }
  });
}

const url = 'https://learn.dcollege.net/webapps/calendar/calendarFeed/c2d84bf6673c402cb557f2a84ddabd87/learn.ics';
downloadAndPrintICalendar(url);