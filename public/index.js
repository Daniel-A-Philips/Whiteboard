function dateFromBBString(str) {
	return new Date(Date.parse(str))
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
  //runs every 7 days
  document.addEventListener("DOMContentLoaded", function() {
	updateCalendar();
	setInterval(updateCalendar, 7 * 24 * 60 * 60 * 1000);
  });
  
  






  
  


  
  
  
  
  
  
  

  