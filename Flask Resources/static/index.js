var displayedWeekStart = startOfCurrentWeek();
const beginningOfTerm = new Date("Mon Apr 3 2023");

var assignments, classes, assignment_matching;

function init() {
	let req = new XMLHttpRequest();
	req.open("GET", "http://localhost:2000/get-persistent-info");
	req.send();
	if (req.status != 200) {
		throw "could not get /get-persistent-info";
	}
	let res = JSON.parse(req.responseText);
	if (res.has_assignments && res.has_classes && res.has_link) {
		assignments = res.calendar;
		classes = res.classes;
		assignment_matching = res.assignments;
		prepMainPage();
		applyDataToPage();
	}
}

function prepMainPage() {
	document.getElementById("ctrl-a-input-window").remove();
	updateCalendar();
	calendartime();
}

// collect user's calendar data from blackboard - done on page load
document.getElementById("ctrl-a-input-submit").onclick = () => {
	let req = new XMLHttpRequest();
	req.open("PUT", "http://localhost:2000/put-classes")
	console.log(document.getElementById("ctrl-a-input-textarea").value)
	req.setRequestHeader('user-blackboard-copied',JSON.stringify(encodeURIComponent(document.getElementById("ctrl-a-input-textarea").value)))
	req.setRequestHeader('user-blackboard-calendar-link',JSON.stringify(encodeURIComponent(document.getElementById("calendar-link-input").value)))
	req.send(document.getElementById("ctrl-a-input-textarea").value)

	prepMainPage();
	setTimeout(getRemoteData, 2500); // wait 1 second to make sure data is properly handled by server
}

function dateFromBBString(str) {
	// return new Date(Date.parse(str));
	// temp while we don't have data from this term
	//return new Date(Date.parse(str) + (1000 * 3600 * 24 * 7 * 12));
	return new Date(Date.parse(str));
}

function startOfCurrentWeek() {
	let now = new Date();
	let monday = new Date(now.getTime() - (1000 * 3600 * 24 * ((now.getDay() == 0 ? 7 : now.getDay()) - 1)));
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

function getRemoteData() {
	// uncomment this when we connect client and server, for now temp data will be used instead
	let req = new XMLHttpRequest()

	req.open("GET", "http://localhost:2000/get-blackboard-calendar", false)
	req.send()
	if (req.status != 200) {
		throw "could not get /get-blackboard-calendar";
	}
	assignments = JSON.parse(req.responseText)

	req.open("GET", "http://localhost:2000/get-classes", false)
	req.send()
	if (req.status != 200) {
		throw "could not get /get-classes";
	}
	classes = JSON.parse(req.responseText)

	req.open("GET", "http://localhost:2000/get-assignment-information", false)
	req.send()
	if (req.status != 200) {
		throw "could not get /get-classes";
	}
	assignment_matching = JSON.parse(req.responseText)

	applyDataToPage();
}

function applyDataToPage() {
	applyDataToCalendar();
	applyDataToSidebar();
	applyDataToAssignments();
}
classColorMap = {};

function applyDataToCalendar() {

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
		const checkbox = document.getElementById('box-${className}')
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
			const color = classColors[Object.keys(classes).indexOf(className) % classColors.length];
	
			classElement.style.position = 'absolute';
			classElement.style.top = `${hourHeight * startHour + hourHeight * startMinute / 60}px`;
			classElement.style.height = `${hourHeight * (duration / 60)}px`;
			classElement.style.backgroundColor = classColors[Object.keys(classes).indexOf(className) % classColors.length];
	
			classElement.innerHTML = className + '<br>' + classInfo.instructor;
	
			classColorMap[className] = color;

			column.appendChild(classElement);
			}
  
		});
  
	}
	return classColorMap;
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

function applyDataToSidebar() {
	let dateCounts = {};
	console.log(assignments)
	for (key of Object.keys(assignments)) {
		if (key.startsWith("_blackboard.platform.gradebook2.GradableItem")) {
			let dateString = dateFromBBString(assignments[key].end).toDateString();
			//console.log('assignments[key]',assignments[key])
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
		const classColors = ['#FFC107', '#3F51B5', '#8BC34A', '#808080', '#009688', '#9E9764', '#308446', '#A18594', '#412227'];
		const classFilters = document.getElementById("class-filters");
		
		Object.keys(classes).forEach((courseKey, index) => {
			const courseDiv = document.createElement("div");
			const label = document.createElement("label");
			const input = document.createElement("input");
			
			input.type = "checkbox";
			input.checked = true; // Set the initial state to checked
			input.id = `box-${courseKey}`;
			input.classList.add("box"); // Add the class name to the input element
			label.textContent = courseKey;
		
			label.classList.add("checkbox-button"); // Add the class name to the label element
			label.style.backgroundColor = classColors[index % classColors.length]; // Set the background color of the label to a color from the classColors array
			label.appendChild(input);
			courseDiv.appendChild(label);
			classFilters.appendChild(courseDiv);
			
			// Add event listener to toggle checked and unchecked class on label
			input.addEventListener("change", () => {
				if (input.checked) {
					label.classList.remove("unchecked");
					label.style.backgroundColor = classColors[index % classColors.length];
				} else {
					label.classList.add("unchecked");
					label.style.backgroundColor = "white";
				}
				applyDataToCalendar(assignments, classes);
			});
		});
		window.hasRunOnce = true; // Set the flag variable to true
	}
			
}

function setDisplayedWeek(week) {
	displayedWeekStart = new Date(beginningOfTerm.getTime() + (1000 * 3600 * 24 * 7 * week));
	applyDataToPage();
	updateCalendar();
}

function applyDataToAssignments() {
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
		col.innerHTML += '<div class="due-date-entry calendar_calendar1"><span class="due-date-time">' + time + '</span> ' + assignments[key].name + '\n' + assignments[key].description + '</div>'
	}

	const pattern = /GradableItem-_(\d+)/;

	for (const key in assignments) {
		const match = key.match(pattern);
		if (match) {
			const number = parseInt(match[1], 10);
			const assignment = assignments[key];
			const summary = assignments[key].description;

			// Look for a matching key in assignment_matching
			let matchingObject = null;
			for (const matchingKey in assignment_matching) {
				if (parseInt(matchingKey, 10) === number) {
					matchingObject = assignment_matching[matchingKey]
					assignments[key].className = matchingObject['Standard Name']
					console.log(matchingKey,':',matchingObject,':',assignments[key])
					break;
				}
			}

			if (!!matchingObject && matchingObject["Standard Name"] !== "") {
				const standardName = matchingObject["Standard Name"];
				console.log('standardName:',standardName)
				const color = classColorMap[standardName];
				assignment.color = color;  // Get color from classColorMap
				
				const dueDateEntries = document.getElementsByClassName('due-date-entry');
				for (let i = 0; i < dueDateEntries.length; i++) {
					if (dueDateEntries[i].innerHTML.includes(summary)) {
						// Set the background color of the due-date-entry element
						dueDateEntries[i].style.backgroundColor = color;
						// delete if filtered
						const checkbox = document.getElementById('box-${standardName}')
						if (checkbox && !checkbox.checked) {
							dueDateEntries[i].remove()
						}
						break;
					}
				}

			}
		}
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

init();
