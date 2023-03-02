var currentWeekStart = startOfCurrentWeek()

function dateFromBBString(str) {
	return new Date(Date.parse(str))
}

function startOfCurrentWeek() {
	// TODO, currently hardcoded
	return new Date("Mon Feb 27 2023")
}
function inWeek(weekStart, date) {
	let startEpoch = weekStart.getTime(), dateEpoch = date.getTime()
	return startEpoch <= dateEpoch && startEpoch + (1000 * 3600 * 24 * 7) >= dateEpoch
}

function applyDataToPage(data) {
	applyDataToCalendar(data)
	applyDataToSidebar(data)
	applyDataToAssignments(data)
}


function applyDataToCalendar(data) {
	for (key of Object.keys(data)) {
		if (!key.startsWith("_blackboard.platform.gradebook2.GradableItem")) {
			continue;
		}
	}
}

function applyDataToSidebar(data) {
	for (key of Object.keys(data)) {
		if (!key.startsWith("_blackboard.platform.gradebook2.GradableItem")) {
			continue
		}
	}
}

function applyDataToAssignments(data) {
	for (key of Object.keys(data)) {
		if (!key.startsWith("_blackboard.platform.gradebook2.GradableItem")) {
			continue
		}
		let dueDate = dateFromBBString(data[key].end)
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
		col.innerHTML += '<div class="due-date-entry calendar_calendar1"><span class="due-date-time">' + time + '</span> ' + data[key].summary + '</div>'
	}
}


//add auto dates to the calendar instead of manuel input

function updateCalendar() {
	const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
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