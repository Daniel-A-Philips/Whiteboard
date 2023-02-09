const ical = require('node-ical');

const events = ical.sync.parseFile.fromURL('https://learn.dcollege.net/webapps/calendar/calendarFeed/c2d84bf6673c402cb557f2a84ddabd87/learn.ics');

console.log(events);

// you can also use the async lib to download and parse iCal from the web
const webEvents = await ical.async.fromURL('https://learn.dcollege.net/webapps/calendar/calendarFeed/c2d84bf6673c402cb557f2a84ddabd87/learn.ics');
// also you can pass options to axios.get() (optional though!)
const headerWebEvents = await ical.async.fromURL(
    'http://lanyrd.com/topics/nodejs/nodejs.ics',
    { headers: { 'User-Agent': 'API-Example / 1.0' } }
);

console.log(webEvents)