// Array to store assignments
var assignments = [];

// Function to add an assignment
function addAssignment(assignmentName, dueDate, className, description) {
    var assignment = {
        name: assignmentName,
        due: new Date(dueDate),
        class: className,
        description: description
    };

    assignments.push(assignment);

    // Sort assignments based on due date and time
    sortAssignments()
}

function sortAssignments(){
    assignments.sort(function(a, b) {
        return a.due - b.due;
    });
}

function showData() {
    var assignmentsList = document.querySelector('.assignments ul');
    assignmentsList.innerHTML = '';

    var assignmentsByDay = groupAssignmentsByDay();

    for (var day in assignmentsByDay) {
        var assignmentsGroup = assignmentsByDay[day];
        var dayHeader = document.createElement('p');
        dayHeader.classList.add('day-header');
        dayHeader.textContent = day;
        assignmentsList.appendChild(dayHeader);

        assignmentsGroup.forEach(function(assignment) {
            var assignmentItem = document.createElement('li');
            var options = { weekday: 'short', day: 'numeric' };
            var formattedDueDate = assignment.due.toLocaleDateString('en-US', options);

            assignmentItem.innerHTML = '<span class="due-date"></span><span class="assignment">' + assignment.name + ' (' + assignment.class + ')</span>';
            assignmentsList.appendChild(assignmentItem);
        });
    }
}

function groupAssignmentsByDay() {
    var assignmentsByDay = {};

    assignments.forEach(function(assignment) {
        var options = { weekday: 'long', month: 'long', day: 'numeric' };
        var formattedDueDate = assignment.due.toLocaleDateString('en-US', options);

        if (assignmentsByDay[formattedDueDate]) {
            assignmentsByDay[formattedDueDate].push(assignment);
        } else {
            assignmentsByDay[formattedDueDate] = [assignment];
        }
    });
    return assignmentsByDay;
}

function updateCalendar() {
    var calendarColumns = document.querySelectorAll('.calendar-column');

    var assignmentsByDay = groupAssignmentsByDay();

    for (var date in assignmentsByDay) {
        var day = date.split(',')[0]
        var assignmentsGroup = assignmentsByDay[date];
        var columnIndex = getDayIndex(day); // Get the index of the day (0 for Monday, 1 for Tuesday, etc.)
        if (columnIndex !== -1) {
            var column = calendarColumns[columnIndex];
            var assignmentsContainer = column.querySelector('.assignments');

            var dayHeader = document.createElement('h3');
            dayHeader.textContent = day;
            assignmentsContainer.appendChild(dayHeader);

            assignmentsGroup.forEach(function(assignment) {
                var assignmentItem = document.createElement('p');
                assignmentItem.textContent = assignment.name + ' (' + assignment.class + ')';
                assignmentsContainer.appendChild(assignmentItem);
            });
        }
    }
}

function getDayIndex(day) {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return daysOfWeek.indexOf(day);
}

function updateMiniCalendar() {
    var miniCalendar = document.querySelector('.mini-calendar');
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();
    var firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    var miniCalendarTable = miniCalendar.querySelector('table');
    var miniCalendarMonthHeader = miniCalendar.querySelector('h2');
    var miniCalendarTableBody = miniCalendarTable.querySelector('tbody');

    // Update month header
    var monthName = getMonthName(currentMonth);
    miniCalendarMonthHeader.textContent = monthName + ' ' + currentYear;

    // Clear existing days in the table
    miniCalendarTableBody.innerHTML = '';

    // Set starting day based on the first day of the month
    var startingDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

    // Create table rows for the days
    var row = document.createElement('tr');
    for (var i = 0; i < startingDay; i++) {
        row.appendChild(document.createElement('td'));
    }

    var dayIndex = 1;
    for (var i = startingDay; i < 7; i++) {
        var cell = document.createElement('td');
        cell.textContent = dayIndex;
        row.appendChild(cell);
        dayIndex++;
    }

    miniCalendarTableBody.appendChild(row);

    var remainingDays = daysInMonth - dayIndex + 1;
    while (remainingDays > 0) {
        row = document.createElement('tr');
        for (var i = 0; i < 7 && remainingDays > 0; i++) {
            var cell = document.createElement('td');
            cell.textContent = dayIndex;
            row.appendChild(cell);
            dayIndex++;
            remainingDays--;
        }
        miniCalendarTableBody.appendChild(row);
    }
}

function getMonthName(month) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
}

// Example usage
addAssignment('Math Homework', '2023-07-06T09:00:00', 'Math Class', 'temp');
addAssignment('Science Project', '2023-07-06T14:30:00', 'Science Class', 'temp');
addAssignment('English Essay', '2023-07-06T11:00:00', 'English Class','temp');
addAssignment('History Project', '2023-07-10T13:00:00', 'History Class','temp');

showData()
updateCalendar()
updateMiniCalendar()
console.log('Done')
