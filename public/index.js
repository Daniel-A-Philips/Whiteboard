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

  
  


  
  
  
  
  
  
  

  