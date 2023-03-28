var currentWeekStart = startOfCurrentWeek()

// collect user's calendar data from blackboard - done on page load
document.getElementById("ctrl-a-input-submit").onclick = () => {
	let req = new XMLHttpRequest()

	req.open("PUT", "http://localhost:2000/put-classes")
	console.log(document.getElementById("ctrl-a-input-textarea").value)
	req.setRequestHeader('user-blackboard-copied',JSON.stringify(encodeURIComponent(document.getElementById("ctrl-a-input-textarea").value)))
	req.setRequestHeader('user-blackboard-calendar-link',JSON.stringify(encodeURIComponent(document.getElementById("calendar-link-input").value)))
	req.send(document.getElementById("ctrl-a-input-textarea").value)
	document.getElementById("ctrl-a-input-window").remove()
	updateCalendar()
	setTimeout(applyDataToPage, 1000) // wait 1 second to make sure data is properly handled by server
}

function dateFromBBString(str) {
	return new Date(Date.parse(str))
}

function startOfCurrentWeek() {
	// TODO, currently hardcoded
	return new Date("Mon Mar 13 2023")
}
function inWeek(weekStart, date) {
	let startEpoch = weekStart.getTime(), dateEpoch = date.getTime()
	return startEpoch <= dateEpoch && startEpoch + (1000 * 3600 * 24 * 7) >= dateEpoch
}

function applyDataToPage() {
	// uncomment this when we connect client and server, for now temp data will be used instead
	let req = new XMLHttpRequest()

	req.open("GET", "http://localhost:2000/get-blackboard-calendar", false)
	req.send()

	if (req.status != 200) {
	 	throw Exception("could not get /get-blackboard-calendar")
	}
	let assignments = JSON.parse(req.responseText)
	console.log('Assignments')
	console.log(assignments)
	req.open("GET", "http://localhost:2000/get-classes", false)
	req.send()
	if (req.status != 200) {
		throw Exception("could not get /get-classes")
	}
	let classes = JSON.parse(req.responseText)
	console.log('Classes')
	console.log(classes)
	// hardcoded, remove when server hooked up
	applyDataToCalendar(assignments, classes)
	applyDataToSidebar(assignments, classes)
	applyDataToAssignments(assignments, classes)
}


function applyDataToCalendar(assignments, classes) {
	for (key of Object.keys(classes)) {
		if (!key.startsWith("_blackboard.platform.gradebook2.GradableItem")) {
			continue;
		}
	}
}

function applyDataToSidebar(assignments, classes) {
	let beginningOfTerm = new Date("Sun Jan 8 2023") // temporarily hard coded
	let currDate = new Date(beginningOfTerm)
	let html = ""
	for (let i = 0; i < 11; i++) {
		html += '<tr><td class="ltc-weeknum">' + (i == 10 ? "F" : i + 1) + "</td>"
		for (let j = 0; j < 7; j++) {
			currDate.setDate(currDate.getDate() + 1)
			html += "<td>" + currDate.getDate() + "</td>"
		}
		if (i == 0 || currDate.getDate() <= 7) {
			html += '<td class="ltc-month">' + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][currDate.getMonth()] + '</td>'
		}
		html += "</tr>"
	}
	document.getElementById("ltc-table").innerHTML = html
}

function applyDataToAssignments(assignments, classes) {
	for (key of Object.keys(assignments)) {
		if (!key.startsWith("_blackboard.platform.gradebook2.GradableItem")) {
			continue
		}
		let dueDate = dateFromBBString(assignments[key].end)
		if (!inWeek(currentWeekStart, dueDate)) {
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
		console.log('added assignment')
	}
}


//add auto dates to the calendar instead of manuel input

function updateCalendar() {
	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const today = new Date();
	const todayIndex = today.getDay();
  
	for (let i = 1; i < 8; i++) {
	  const date = new Date(today);
	  date.setDate(date.getDate() + i - todayIndex);
	  const dayOfWeek = daysOfWeek[date.getDay()];
	  const dayOfMonth = date.getDate();
	  const elementId = "day" + i;
	  const element = document.getElementById(elementId);
	  element.textContent = `${dayOfWeek}, ${dayOfMonth}`;
		//helps find current date for bold
	  if(i === todayIndex + 0) {
		element.classList.add("current-date");
	  }
	}
  }