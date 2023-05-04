var displayedWeekStart = startOfCurrentWeek();
const beginningOfTerm = new Date("Mon Apr 3 2023");

// collect user's calendar data from blackboard - done on page load
document.getElementById("ctrl-a-input-submit").onclick = () => {
	let req = new XMLHttpRequest()
	req.open("PUT", "http://localhost:2000/put-classes")
	req.send(document.getElementById("ctrl-a-input-textarea").value)
	document.getElementById("ctrl-a-input-window").remove()
	updateCalendar()
	calendartime()
	setTimeout(applyDataToPage, 1000) // wait 1 second to make sure data is properly handled by server
}

function dateFromBBString(str) {
	// return new Date(Date.parse(str));
	// temp while we don't have data from this term
	return new Date(Date.parse(str) + (1000 * 3600 * 24 * 7 * 12));
}

function startOfCurrentWeek() {
	let now = new Date();
	let monday = new Date(now.getTime() - (1000 * 3600 * 24 * (now.getDay() - 1)));
	monday.setHours(0);
	monday.setMinutes(0);
	monday.setSeconds(0);
	monday.setMilliseconds(0);
	return monday
}
function inWeek(weekStart, date) {
	let startEpoch = weekStart.getTime(), dateEpoch = date.getTime()
	return startEpoch <= dateEpoch && startEpoch + (1000 * 3600 * 24 * 7) >= dateEpoch
}

function applyDataToPage() {
	// uncomment this when we connect client and server, for now temp data will be used instead
	// let req = new XMLHttpRequest()

	// req.open("GET", "http://localhost:2000/get-blackboard-calendar", false)
	// req.send()
	// if (req.status != 200) {
	// 	throw Exception("could not get /get-blackboard-calendar")
	// }
	// let assignments = JSON.parse(req.responseText)

	// req.open("GET", "http://localhost:2000/get-classes", false)
	// req.send()
	// if (req.status != 200) {
	// 	throw Exception("could not get /get-classes")
	// }
	// let classes = JSON.parse(req.responseText)

	// hardcoded, remove when server hooked up
	let assignments = {"80999.10500096728":{"type":"VTIMEZONE","params":[],"tzid":"America/New_York","lastmodified":"2022-11-05T02:45:26.000Z","tzurl":"https://www.tzurl.org/zoneinfo/America/New_York","LIC-LOCATION":"America/New_York","PROLEPTIC-TZNAME":"LMT","30955.354569209503":{"type":"STANDARD","params":[],"tzname":"EST","tzoffsetfrom":"-045602","tzoffsetto":"-0500","start":"1883-11-18T17:03:58.000Z"},"41987.46593692275":{"type":"DAYLIGHT","params":[],"tzname":"EDT","tzoffsetfrom":"-0500","tzoffsetto":"-0400","start":"1918-03-31T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=19200328T070000Z;BYMONTH=3;BYDAY=-1SU"},"51822.64600451707":{"type":"STANDARD","params":[],"tzname":"EST","tzoffsetfrom":"-0400","tzoffsetto":"-0500","start":"1918-10-27T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=19201031T060000Z;BYMONTH=10;BYDAY=-1SU"},"34613.236379445465":{"type":"DAYLIGHT","params":[],"tzname":"EDT","tzoffsetfrom":"-0500","tzoffsetto":"-0400","start":"1921-04-24T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=19410427T070000Z;BYMONTH=4;BYDAY=-1SU"},"50993.51847260223":{"type":"STANDARD","params":[],"tzname":"EST","tzoffsetfrom":"-0400","tzoffsetto":"-0500","start":"1921-09-25T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=19410928T060000Z;BYMONTH=9;BYDAY=-1SU"},"12948.5128074059":{"type":"DAYLIGHT","params":[],"tzname":"EWT","tzoffsetfrom":"-0500","tzoffsetto":"-0400","start":"1942-02-09T07:00:00.000Z"},"37075.30485826951":{"type":"DAYLIGHT","params":[],"tzname":"EPT","tzoffsetfrom":"-0400","tzoffsetto":"-0400","start":"1945-08-14T23:00:00.000Z"},"63783.69166145337":{"type":"STANDARD","params":[],"tzname":"EST","tzoffsetfrom":"-0400","tzoffsetto":"-0500","start":"1945-09-30T07:00:00.000Z"},"17634.020024743146":{"type":"DAYLIGHT","params":[],"tzname":"EDT","tzoffsetfrom":"-0500","tzoffsetto":"-0400","start":"1946-04-28T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=19730429T070000Z;BYMONTH=4;BYDAY=-1SU"},"10541.839365227212":{"type":"STANDARD","params":[],"tzname":"EST","tzoffsetfrom":"-0400","tzoffsetto":"-0500","start":"1946-09-29T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=19540926T060000Z;BYMONTH=9;BYDAY=-1SU"},"42746.58387120085":{"type":"STANDARD","params":[],"tzname":"EST","tzoffsetfrom":"-0400","tzoffsetto":"-0500","start":"1955-10-30T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=20061029T060000Z;BYMONTH=10;BYDAY=-1SU"},"10204.773282227508":{"type":"DAYLIGHT","params":[],"tzname":"EDT","tzoffsetfrom":"-0500","tzoffsetto":"-0400","start":"1974-01-06T07:00:00.000Z","rdate":"19750223T020000"},"95578.48590770904":{"type":"DAYLIGHT","params":[],"tzname":"EDT","tzoffsetfrom":"-0500","tzoffsetto":"-0400","start":"1976-04-25T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=19860427T070000Z;BYMONTH=4;BYDAY=-1SU"},"67347.98265838878":{"type":"DAYLIGHT","params":[],"tzname":"EDT","tzoffsetfrom":"-0500","tzoffsetto":"-0400","start":"1987-04-05T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;UNTIL=20060402T070000Z;BYMONTH=4;BYDAY=1SU"},"34350.58664605451":{"type":"DAYLIGHT","params":[],"tzname":"EDT","tzoffsetfrom":"-0500","tzoffsetto":"-0400","start":"2007-03-11T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU"},"99328.36321505028":{"type":"STANDARD","params":[],"tzname":"EST","tzoffsetfrom":"-0400","tzoffsetto":"-0500","start":"2007-11-04T07:00:00.000Z","rrule":"RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU"}},"_blackboard.platform.gradebook2.GradableItem-_2868714_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-12T04:59:00.000Z","end":"2023-01-12T04:59:00.000Z","summary":"Introduction on Disc Brd","uid":"_blackboard.platform.gradebook2.GradableItem-_2868714_1","description":"<p>Discussion board post introduction</p>"},"_blackboard.platform.gradebook2.GradableItem-_2879630_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-10T21:00:00.000Z","end":"2023-01-10T21:00:00.000Z","summary":"AttLect1","uid":"_blackboard.platform.gradebook2.GradableItem-_2879630_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868716_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-14T04:59:00.000Z","end":"2023-01-14T04:59:00.000Z","summary":"AttLab1","uid":"_blackboard.platform.gradebook2.GradableItem-_2868716_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2890015_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-17T04:59:00.000Z","end":"2023-01-17T04:59:00.000Z","summary":"Lab 1 Experience Report (ind)","uid":"_blackboard.platform.gradebook2.GradableItem-_2890015_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868717_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-17T04:59:00.000Z","end":"2023-01-17T04:59:00.000Z","summary":"Homework Reading Week 1","uid":"_blackboard.platform.gradebook2.GradableItem-_2868717_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868718_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-17T04:59:00.000Z","end":"2023-01-17T04:59:00.000Z","summary":"Reflection 1","uid":"_blackboard.platform.gradebook2.GradableItem-_2868718_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868766_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-18T04:59:00.000Z","end":"2023-01-18T04:59:00.000Z","summary":"Week 2 Attendance Question","uid":"_blackboard.platform.gradebook2.GradableItem-_2868766_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868720_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-20T22:00:00.000Z","end":"2023-01-20T22:00:00.000Z","summary":"AttLab2","uid":"_blackboard.platform.gradebook2.GradableItem-_2868720_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868721_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-24T04:59:00.000Z","end":"2023-01-24T04:59:00.000Z","summary":"Turn in Team Profile Here","uid":"_blackboard.platform.gradebook2.GradableItem-_2868721_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868722_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-24T04:59:00.000Z","end":"2023-01-24T04:59:00.000Z","summary":"Reflection 2","uid":"_blackboard.platform.gradebook2.GradableItem-_2868722_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868724_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-24T22:00:00.000Z","end":"2023-01-24T22:00:00.000Z","summary":"Attendance Wk 3","uid":"_blackboard.platform.gradebook2.GradableItem-_2868724_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868726_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-28T00:00:00.000Z","end":"2023-01-28T00:00:00.000Z","summary":"AttLab3","uid":"_blackboard.platform.gradebook2.GradableItem-_2868726_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2920151_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-31T04:59:00.000Z","end":"2023-01-31T04:59:00.000Z","summary":"Lab3","uid":"_blackboard.platform.gradebook2.GradableItem-_2920151_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868728_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-31T04:59:00.000Z","end":"2023-01-31T04:59:00.000Z","summary":"Reflection 3","uid":"_blackboard.platform.gradebook2.GradableItem-_2868728_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868729_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-31T04:59:00.000Z","end":"2023-01-31T04:59:00.000Z","summary":"Week 3 Homework Quiz","uid":"_blackboard.platform.gradebook2.GradableItem-_2868729_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868730_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-01T04:59:00.000Z","end":"2023-02-01T04:59:00.000Z","summary":"AttLect4","uid":"_blackboard.platform.gradebook2.GradableItem-_2868730_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868731_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-03T22:00:00.000Z","end":"2023-02-03T22:00:00.000Z","summary":"AttLab4","uid":"_blackboard.platform.gradebook2.GradableItem-_2868731_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868732_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-07T04:59:00.000Z","end":"2023-02-07T04:59:00.000Z","summary":"Lab 4 - User Stories","uid":"_blackboard.platform.gradebook2.GradableItem-_2868732_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868733_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-07T04:59:00.000Z","end":"2023-02-07T04:59:00.000Z","summary":"Homework 4","uid":"_blackboard.platform.gradebook2.GradableItem-_2868733_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868734_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-07T04:59:00.000Z","end":"2023-02-07T04:59:00.000Z","summary":"Reflection 4","uid":"_blackboard.platform.gradebook2.GradableItem-_2868734_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868736_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-10T22:00:00.000Z","end":"2023-02-10T22:00:00.000Z","summary":"AttLab5","uid":"_blackboard.platform.gradebook2.GradableItem-_2868736_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868737_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-14T04:59:00.000Z","end":"2023-02-14T04:59:00.000Z","summary":"Week 5 Lab","uid":"_blackboard.platform.gradebook2.GradableItem-_2868737_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868738_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-14T04:59:00.000Z","end":"2023-02-14T04:59:00.000Z","summary":"CLI and GIT Assignment","uid":"_blackboard.platform.gradebook2.GradableItem-_2868738_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868739_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-14T04:59:00.000Z","end":"2023-02-14T04:59:00.000Z","summary":"Reflection 5","uid":"_blackboard.platform.gradebook2.GradableItem-_2868739_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868740_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-14T04:59:00.000Z","end":"2023-02-14T04:59:00.000Z","summary":"Mid Term Self Evaluation","uid":"_blackboard.platform.gradebook2.GradableItem-_2868740_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868741_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-14T22:00:00.000Z","end":"2023-02-14T22:00:00.000Z","summary":"AttLect6","uid":"_blackboard.platform.gradebook2.GradableItem-_2868741_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868742_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-23T23:00:00.000Z","end":"2023-02-23T23:00:00.000Z","summary":"Q2","uid":"_blackboard.platform.gradebook2.GradableItem-_2868742_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868743_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-17T22:00:00.000Z","end":"2023-02-17T22:00:00.000Z","summary":"AttLab6","uid":"_blackboard.platform.gradebook2.GradableItem-_2868743_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868744_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-21T04:59:00.000Z","end":"2023-02-21T04:59:00.000Z","summary":"Lab 6","uid":"_blackboard.platform.gradebook2.GradableItem-_2868744_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868745_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-21T04:59:00.000Z","end":"2023-02-21T04:59:00.000Z","summary":"Week 6 Homework","uid":"_blackboard.platform.gradebook2.GradableItem-_2868745_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868746_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-21T04:59:00.000Z","end":"2023-02-21T04:59:00.000Z","summary":"Week 6 Reflection","uid":"_blackboard.platform.gradebook2.GradableItem-_2868746_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868747_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-21T22:00:00.000Z","end":"2023-02-21T22:00:00.000Z","summary":"AttLect7","uid":"_blackboard.platform.gradebook2.GradableItem-_2868747_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868748_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-24T22:00:00.000Z","end":"2023-02-24T22:00:00.000Z","summary":"AttLab7","uid":"_blackboard.platform.gradebook2.GradableItem-_2868748_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868749_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-28T04:59:00.000Z","end":"2023-02-28T04:59:00.000Z","summary":"Week 7 Lab","uid":"_blackboard.platform.gradebook2.GradableItem-_2868749_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868750_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-28T04:59:00.000Z","end":"2023-02-28T04:59:00.000Z","summary":"Week7HW","uid":"_blackboard.platform.gradebook2.GradableItem-_2868750_1","description":"<p>Self and Peer evaluation through google form</p>"},"_blackboard.platform.gradebook2.GradableItem-_2868751_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-28T04:59:00.000Z","end":"2023-02-28T04:59:00.000Z","summary":"Reflection 7","uid":"_blackboard.platform.gradebook2.GradableItem-_2868751_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868752_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-28T22:00:00.000Z","end":"2023-02-28T22:00:00.000Z","summary":"AttLect8","uid":"_blackboard.platform.gradebook2.GradableItem-_2868752_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868753_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-03T22:00:00.000Z","end":"2023-03-03T22:00:00.000Z","summary":"AttLab8","uid":"_blackboard.platform.gradebook2.GradableItem-_2868753_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868754_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-07T04:59:00.000Z","end":"2023-03-07T04:59:00.000Z","summary":"Lab 8","uid":"_blackboard.platform.gradebook2.GradableItem-_2868754_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868755_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-07T04:59:00.000Z","end":"2023-03-07T04:59:00.000Z","summary":"Using Feedback","uid":"_blackboard.platform.gradebook2.GradableItem-_2868755_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868756_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-07T04:59:00.000Z","end":"2023-03-07T04:59:00.000Z","summary":"Reflection 8","uid":"_blackboard.platform.gradebook2.GradableItem-_2868756_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868757_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-07T22:00:00.000Z","end":"2023-03-07T22:00:00.000Z","summary":"AttLect9","uid":"_blackboard.platform.gradebook2.GradableItem-_2868757_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868758_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-07T22:00:00.000Z","end":"2023-03-07T22:00:00.000Z","summary":"Q3","uid":"_blackboard.platform.gradebook2.GradableItem-_2868758_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868759_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-11T04:59:00.000Z","end":"2023-03-11T04:59:00.000Z","summary":"AttLab9","uid":"_blackboard.platform.gradebook2.GradableItem-_2868759_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868760_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-14T03:59:00.000Z","end":"2023-03-14T03:59:00.000Z","summary":"Week 9 Lab","uid":"_blackboard.platform.gradebook2.GradableItem-_2868760_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868761_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-14T03:59:00.000Z","end":"2023-03-14T03:59:00.000Z","summary":"Presentation Outline","uid":"_blackboard.platform.gradebook2.GradableItem-_2868761_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868762_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-14T03:59:00.000Z","end":"2023-03-14T03:59:00.000Z","summary":"Reflection 9","uid":"_blackboard.platform.gradebook2.GradableItem-_2868762_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868764_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-15T03:59:00.000Z","end":"2023-03-15T03:59:00.000Z","summary":"AttLect10","uid":"_blackboard.platform.gradebook2.GradableItem-_2868764_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868767_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-21T03:59:00.000Z","end":"2023-03-21T03:59:00.000Z","summary":"Final Self Evaluation","uid":"_blackboard.platform.gradebook2.GradableItem-_2868767_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868768_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-21T03:59:00.000Z","end":"2023-03-21T03:59:00.000Z","summary":"FinalPres","uid":"_blackboard.platform.gradebook2.GradableItem-_2868768_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868770_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-16T03:59:00.000Z","end":"2023-03-16T03:59:00.000Z","summary":"Final Presentations","uid":"_blackboard.platform.gradebook2.GradableItem-_2868770_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2868772_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-21T03:59:00.000Z","end":"2023-03-21T03:59:00.000Z","summary":"Feedback and Surveys","uid":"_blackboard.platform.gradebook2.GradableItem-_2868772_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2898596_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-30T04:30:00.000Z","end":"2023-01-30T04:30:00.000Z","summary":"Week 3 Quiz","uid":"_blackboard.platform.gradebook2.GradableItem-_2898596_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2901292_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-06T04:59:00.000Z","end":"2023-02-06T04:59:00.000Z","summary":"Resume Re-Submits - Due Sunday, 2/5 at Midnight","uid":"_blackboard.platform.gradebook2.GradableItem-_2901292_1"},"_blackboard.platform.gradebook2.GradableItem-_2916772_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-30T04:59:00.000Z","end":"2023-01-30T04:59:00.000Z","summary":"Resume Rough Draft due Sunday, January 29th at Midnight","uid":"_blackboard.platform.gradebook2.GradableItem-_2916772_1","description":""},"_blackboard.platform.gradebook2.GradableItem-_2885668_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-16T04:59:00.000Z","end":"2023-01-16T04:59:00.000Z","summary":"Discussion Board #1 Pick Your Thing","uid":"_blackboard.platform.gradebook2.GradableItem-_2885668_1"},"_blackboard.platform.gradebook2.GradableItem-_2885672_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-25T04:59:00.000Z","end":"2023-01-25T04:59:00.000Z","summary":"Discussion Board#2 Developing a historical consciousness due 1/24","uid":"_blackboard.platform.gradebook2.GradableItem-_2885672_1"},"_blackboard.platform.gradebook2.GradableItem-_2886179_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-02T04:59:00.000Z","end":"2023-02-02T04:59:00.000Z","summary":"Literature Review Rough Draft","uid":"_blackboard.platform.gradebook2.GradableItem-_2886179_1"},"_blackboard.platform.gradebook2.GradableItem-_2886180_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-08T04:59:00.000Z","end":"2023-02-08T04:59:00.000Z","summary":"Literature Review Final Version","uid":"_blackboard.platform.gradebook2.GradableItem-_2886180_1"},"_blackboard.platform.gradebook2.GradableItem-_2886181_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-25T04:59:00.000Z","end":"2023-01-25T04:59:00.000Z","summary":"Submit Project Pitch Rough Draft","uid":"_blackboard.platform.gradebook2.GradableItem-_2886181_1"},"_blackboard.platform.gradebook2.GradableItem-_2907855_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-01T04:59:00.000Z","end":"2023-02-01T04:59:00.000Z","summary":"Discussion Board #3 We Are What We Keep--due Jan 31","uid":"_blackboard.platform.gradebook2.GradableItem-_2907855_1"},"_blackboard.platform.gradebook2.GradableItem-_2919295_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-08T04:59:00.000Z","end":"2023-02-08T04:59:00.000Z","summary":"Discussion Board #4--Did the objects that surrounded you have a bearing on your life?","uid":"_blackboard.platform.gradebook2.GradableItem-_2919295_1"},"_blackboard.platform.gradebook2.GradableItem-_2922555_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-15T04:59:00.000Z","end":"2023-02-15T04:59:00.000Z","summary":"Discussion Board #5","uid":"_blackboard.platform.gradebook2.GradableItem-_2922555_1"},"_blackboard.platform.gradebook2.GradableItem-_2927014_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-22T04:59:00.000Z","end":"2023-02-22T04:59:00.000Z","summary":"Discussion Board #6","uid":"_blackboard.platform.gradebook2.GradableItem-_2927014_1"},"_blackboard.platform.gradebook2.GradableItem-_2927015_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-28T04:59:00.000Z","end":"2023-02-28T04:59:00.000Z","summary":"Academic Paper Rough Draft due week 8","uid":"_blackboard.platform.gradebook2.GradableItem-_2927015_1"},"_blackboard.platform.gradebook2.GradableItem-_2930828_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-01T04:59:00.000Z","end":"2023-03-01T04:59:00.000Z","summary":"Discussion Board 7/Week 8","uid":"_blackboard.platform.gradebook2.GradableItem-_2930828_1"},"_blackboard.platform.gradebook2.GradableItem-_2930829_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-13T03:59:00.000Z","end":"2023-03-13T03:59:00.000Z","summary":"Academic Paper Final Version","uid":"_blackboard.platform.gradebook2.GradableItem-_2930829_1"},"_blackboard.platform.gradebook2.GradableItem-_2898859_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-19T04:59:00.000Z","end":"2023-01-19T04:59:00.000Z","summary":"HW 1: Area as a Limit","uid":"_blackboard.platform.gradebook2.GradableItem-_2898859_1"},"_blackboard.platform.gradebook2.GradableItem-_2898865_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-19T04:59:00.000Z","end":"2023-01-19T04:59:00.000Z","summary":"HW 2: The Definite Integral","uid":"_blackboard.platform.gradebook2.GradableItem-_2898865_1"},"_blackboard.platform.gradebook2.GradableItem-_2898902_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-26T04:59:00.000Z","end":"2023-01-26T04:59:00.000Z","summary":"HW 3: Indefinite Integrals","uid":"_blackboard.platform.gradebook2.GradableItem-_2898902_1"},"_blackboard.platform.gradebook2.GradableItem-_2898915_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-01-26T04:59:00.000Z","end":"2023-01-26T04:59:00.000Z","summary":"HW 4: The Fundamental Theorem of Calculus","uid":"_blackboard.platform.gradebook2.GradableItem-_2898915_1"},"_blackboard.platform.gradebook2.GradableItem-_2898925_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-02T04:59:00.000Z","end":"2023-02-02T04:59:00.000Z","summary":"HW 5: Substitution, Indefinite Integrals","uid":"_blackboard.platform.gradebook2.GradableItem-_2898925_1"},"_blackboard.platform.gradebook2.GradableItem-_2898932_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-02T04:59:00.000Z","end":"2023-02-02T04:59:00.000Z","summary":"HW 6: Substitution, Definite Integrals","uid":"_blackboard.platform.gradebook2.GradableItem-_2898932_1"},"_blackboard.platform.gradebook2.GradableItem-_2898941_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-09T04:59:00.000Z","end":"2023-02-09T04:59:00.000Z","summary":"HW 7: Area Between Curves","uid":"_blackboard.platform.gradebook2.GradableItem-_2898941_1"},"_blackboard.platform.gradebook2.GradableItem-_2898946_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-09T04:59:00.000Z","end":"2023-02-09T04:59:00.000Z","summary":"HW 8: Volumes","uid":"_blackboard.platform.gradebook2.GradableItem-_2898946_1"},"_blackboard.platform.gradebook2.GradableItem-_2898952_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-16T04:59:00.000Z","end":"2023-02-16T04:59:00.000Z","summary":"HW 9: Arc Length","uid":"_blackboard.platform.gradebook2.GradableItem-_2898952_1"},"_blackboard.platform.gradebook2.GradableItem-_2898963_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-16T04:59:00.000Z","end":"2023-02-16T04:59:00.000Z","summary":"HW 10: Work","uid":"_blackboard.platform.gradebook2.GradableItem-_2898963_1"},"_blackboard.platform.gradebook2.GradableItem-_2898968_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-23T04:59:00.000Z","end":"2023-02-23T04:59:00.000Z","summary":"HW 11: Integration by Parts","uid":"_blackboard.platform.gradebook2.GradableItem-_2898968_1"},"_blackboard.platform.gradebook2.GradableItem-_2898969_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-02-23T04:59:00.000Z","end":"2023-02-23T04:59:00.000Z","summary":"HW 12: Partial Fractions","uid":"_blackboard.platform.gradebook2.GradableItem-_2898969_1"},"_blackboard.platform.gradebook2.GradableItem-_2898972_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-02T04:59:00.000Z","end":"2023-03-02T04:59:00.000Z","summary":"HW 13: Improper Integrals","uid":"_blackboard.platform.gradebook2.GradableItem-_2898972_1"},"_blackboard.platform.gradebook2.GradableItem-_2898973_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-09T04:59:00.000Z","end":"2023-03-09T04:59:00.000Z","summary":"HW 15: Trigonometric Integrals","uid":"_blackboard.platform.gradebook2.GradableItem-_2898973_1"},"_blackboard.platform.gradebook2.GradableItem-_2898975_1":{"type":"VEVENT","params":[],"dtstamp":"2023-02-26T17:13:35.000Z","start":"2023-03-09T04:59:00.000Z","end":"2023-03-09T04:59:00.000Z","summary":"HW 14: Separable Equations","uid":"_blackboard.platform.gradebook2.GradableItem-_2898975_1"}}
	let classes = {"PHYS-101-B": {"days": [0, 2], "time": "11:00-12:50", "instructor": "John Doe", "crn": 20000}, 
	"MATH-122-017": {"days": [0, 2, 4], "time": "14:00-14:50", "instructor": "Jane Doe", "crn": 20001}, 
	"CT-200-001": {"days": [1, 3], "time": "14:00-15:20", "instructor": "Hengyi Chu", "crn": 20002},
	"CI-103-060": {"days": [3], "time": "9:00-10:50", "instructor": "Daniel Moix", "crn": 20003},
	"CI-103-B": {"days": [1], "time": "10:00-10:50", "instructor": "Daniel Moix", "crn": 20004},
	"CT-140-001": {"days": [0, 2], "time": "9:00-10:20", "instructor": "Chris Carroll", "crn": 20005},
	"INFO-153-001": {"days": [0, 3], "time": "15:30-16:50", "instructor": "Bo Song", "crn": 20006}}

	applyDataToCalendar(assignments, classes);
	applyDataToSidebar(assignments, classes);
	applyDataToAssignments(assignments, classes);
}

function applyDataToCalendar(assignments, classes) {

	const col0 = document.querySelector('.calendar_col[style="grid-column:3"]');
	const col1 = document.querySelector('.calendar_col[style="grid-column:4"]');
	const col2 = document.querySelector('.calendar_col[style="grid-column:5"]');
	const col3 = document.querySelector('.calendar_col[style="grid-column:6"]');
	const col4 = document.querySelector('.calendar_col[style="grid-column:7"]');
	const col5 = document.querySelector('.calendar_col.calendar_weekend[style="grid-column:8"]');
	const col6 = document.querySelector('.calendar_col.calendar_weekend[style="grid-column:9"]');
 
	const colums = [col0, col1, col2, col3, col4, col5, col6];
	for (let column of colums) {
		const classElement = column.getElementsByClassName("class");
		for (let i = classElement.length - 1; i >= 0; i--) {
			classElement[i].remove();
		}
	}
  
	const classColors = ['#FFC107', '#3F51B5', '#8BC34A', '#808080', '#009688', '#9E9764', '#308446', '#A18594', '#412227'];
	const hourHeight = 47.6;
  
	for (let className in classes) {
	  	const classInfo = classes[className];
	  	const checkbox = document.getElementById(`box-${className}`);
  
		if (checkbox && !checkbox.checked) {
		continue; // skip this class if checkbox is unchecked
		}
  
		const [startTime, endTime] = classInfo.time.split('-');
		const [startHour, startMinute] = startTime.split(':');
		const [endHour, endMinute] = endTime.split(':');
  
	  	classInfo.days.forEach(day => {
			let column;
			if (day === 0) {
			column = col0;
			} else if (day === 1) {
			column = col1;
			} else if (day === 2) {
			column = col2;
			} else if (day === 3) {
			column = col3;
			} else if (day === 4) {
			column = col4;
			} else if (day === 5) {
			column = col5;
			} else if (day === 6) { 
			column = col6;
			}
  
		if (column) {
			const classElement = document.createElement('div');
			classElement.classList.add('class');
	
			const start = parseInt(startHour) * 60 + parseInt(startMinute);
			const end = parseInt(endHour) * 60 + parseInt(endMinute);
			const duration = end - start;
	
			classElement.style.position = 'absolute';
			classElement.style.top = `${hourHeight * startHour + hourHeight * startMinute / 60}px`;
			classElement.style.height = `${hourHeight * (duration / 60)}px`;
			classElement.style.backgroundColor = classColors[Object.keys(classes).indexOf(className) % classColors.length];
	
			classElement.innerHTML = className + '<br>' + classInfo.instructor;
	
			column.appendChild(classElement);
			}
  
		});
  
	}
}  

function calendartime() {
	const myDiv = document.querySelector(".calendar_current-time");
  
	myDiv.classList.add("my-class");
  
	const currentTime = new Date().getTime();
	const currentDateTime = new Date(currentTime);
	const minutes = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
	const pixelsToMove = Math.floor(minutes / 10) * 8;
	const dayOfWeek = currentDateTime.getDay();
  
	// Assign a grid column to the element based on the day of the week
	switch (dayOfWeek) {
	  case 0:
		myDiv.style.gridColumn = "2";
		break;
	  case 1:
		myDiv.style.gridColumn = "3";
		break;
	  case 2:
		myDiv.style.gridColumn = "4";
		break;
	  case 3:
		myDiv.style.gridColumn = "5";
		break;
	  case 4:
		myDiv.style.gridColumn = "6";
		break;
	  case 5:
		myDiv.style.gridColumn = "7";
		break;
	  case 6:
		myDiv.style.gridColumn = "8";
		break;
	  default:
		break;
	}
  
	myDiv.style.top = `${pixelsToMove}px`;
	myDiv.style.left = 0;
	myDiv.style.position = "absolute";
}

function applyDataToSidebar(assignments, classes) {
	let dateCounts = {};
	for (key of Object.keys(assignments)) {
		if (key.startsWith("_blackboard.platform.gradebook2.GradableItem")) {
			let dateString = dateFromBBString(assignments[key].end).toDateString();
			if (dateString in dateCounts) {
				dateCounts[dateString] += 1;
			} else {
				dateCounts[dateString] = 1;
			}
		}
	}

	let currDate = new Date(beginningOfTerm);
	let html = "";
	for (let i = 0; i < 11; i++) {
		html += '<tr onclick="setDisplayedWeek(' + i + ');"><td class="ltc-weeknum">' + (i == 10 ? "F" : i + 1) + "</td>";
		for (let j = 0; j < 7; j++) {
			let numAssignments = dateCounts[currDate.toDateString()];
			switch (numAssignments) {
				case undefined:
					html += "<td>";
					break;
				case 1:
				case 2:
					html += '<td class="ltc-lowprio">';
					break;
				case 3:
				case 4:
					html += '<td class="ltc-medprio">';
					break;
				default:
					html += '<td class="ltc-highprio">';
					break;
			}
			html += currDate.getDate() + "</td>";
			currDate.setDate(currDate.getDate() + 1);
		}
		if (i == 0 || currDate.getDate() <= 7) {
			html += '<td class="ltc-month">' + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][currDate.getMonth()] + '</td>';
		}
		html += "</tr>";
	}
	document.getElementById("ltc-table").innerHTML = html;
	if (!window.hasRunOnce) {
		const classFilters = document.getElementById("class-filters");
		
		Object.keys(classes).forEach(courseKey => {
			const courseDiv = document.createElement("div");
			const label = document.createElement("label");
			const input = document.createElement("input");
			
			input.type = "checkbox";
			input.checked = true; // Set the initial state to checked
			input.id = `box-${courseKey}`;
			input.classList.add("box"); // Add the class name to the input element
			label.textContent = courseKey;
		
			label.classList.add("checkbox-button"); // Add the class name to the label element
			label.appendChild(input);
			courseDiv.appendChild(label);
			classFilters.appendChild(courseDiv);
			
			// Add event listener to toggle checked and unchecked class on label
			input.addEventListener("change", () => {
				if (input.checked) {
					label.classList.remove("unchecked");
				} else {
					label.classList.add("unchecked");
				}
				applyDataToCalendar(assignments, classes);
			});
		});
		
			const checkAllButton = document.createElement("button");
			checkAllButton.textContent = "Check All";
			checkAllButton.classList.add("check-all-button"); // Add the class name to the button element
			checkAllButton.addEventListener("click", () => {
			const inputs = document.querySelectorAll("#class-filters input[type='checkbox']");
			inputs.forEach(input => {
				input.checked = true;
				const label = input.parentElement;
				label.classList.remove("unchecked");
			});
			applyDataToCalendar(assignments, classes);
		});
		classFilters.appendChild(checkAllButton);
		
		const uncheckAllButton = document.createElement("button");
		uncheckAllButton.textContent = "Uncheck All";
		uncheckAllButton.classList.add("uncheck-all-button"); // Add the class name to the button element
		uncheckAllButton.addEventListener("click", () => {
			const inputs = document.querySelectorAll("#class-filters input[type='checkbox']");
			inputs.forEach(input => {
				input.checked = false;
				const label = input.parentElement;
				label.classList.add("unchecked");
			});
			applyDataToCalendar(assignments, classes);
		});
		classFilters.appendChild(uncheckAllButton);
		
		window.hasRunOnce = true; // Set the flag variable to true
	}
			
}

function setDisplayedWeek(week) {
	displayedWeekStart = new Date(beginningOfTerm.getTime() + (1000 * 3600 * 24 * 7 * week));
	applyDataToPage();
	updateCalendar();
}

function applyDataToAssignments(assignments, classes) {
	for (let i = 0; i < 7; i++) {
		document.getElementById("due-dates-grid").children[i].innerHTML = "";
	}
	for (key of Object.keys(assignments)) {
		if (!key.startsWith("_blackboard.platform.gradebook2.GradableItem")) {
			continue
		}
		let dueDate = dateFromBBString(assignments[key].end)
		if (!inWeek(displayedWeekStart, dueDate)) {
			continue
		}
		let col
		if (dueDate.getDay() == 0) {
			col = document.getElementById("due-dates-grid").children[6]
		} else {
			col = document.getElementById("due-dates-grid").children[dueDate.getDay() - 1]
		}
		let time
		if (dueDate.getHours() == 23 && dueDate.getMinutes() >= 50) {
			time = "EOD"
		} else {
			time = (dueDate.getHours() % 12) + (dueDate.getHours() > 12 ? "pm" : "am")
		}
		col.innerHTML += '<div class="due-date-entry calendar_calendar1"><span class="due-date-time">' + time + '</span> ' + assignments[key].summary + '</div>'
	}
}

// add auto dates to the calendar instead of manuel input

function updateCalendar() {
	const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	let today = new Date();

	for (let i = 0; i < 7; i++) {
		const date = new Date(displayedWeekStart);
		date.setDate(date.getDate() + i);
		const dayOfWeek = daysOfWeek[date.getDay()];
		const dayOfMonth = date.getDate();
		const elementId = "day" + (i + 1);
		const element = document.getElementById(elementId);
		element.textContent = `${dayOfWeek}, ${dayOfMonth}`;
		// helps find current date for bold
		if (date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {
			element.classList.add("current-date");
		} else {
			element.classList.remove("current-date");
		}
	}
}
