// Wait for the DOM to finish loading
document.addEventListener('DOMContentLoaded', function() {
    // Array to store assignments
    var assignments = [];

    // Function to add an assignment
    function addAssignment(assignmentName, dueDate, className) {
        var assignment = {
            name: assignmentName,
            due: new Date(dueDate),
            class: className
        };

        assignments.push(assignment);

        // Sort assignments based on due date and time
        assignments.sort(function(a, b) {
            return a.due - b.due;
        });
        console.log(assignments)

        var assignmentsList = document.querySelector('.assignments ul');
        var assignmentItem = document.createElement('li');

        // Format due date to display the day of the week and day of the month
        var options = { weekday: 'short', day: 'numeric' };
        var formattedDueDate = assignment.due.toLocaleDateString('en-US', options);

        assignmentItem.innerHTML = '<span class="due-date">' + formattedDueDate + ':</span><span class="assignment">' + assignmentName + '</span>';
        assignmentsList.appendChild(assignmentItem);

        var calendarContent = document.querySelector('.calendar');

        // Create a new grouping element if it doesn't exist for the due date
        var groupingElement = document.getElementById(assignment.due.toISOString().slice(0, 10));
        if (!groupingElement) {
            groupingElement = document.createElement('div');
            groupingElement.id = assignment.due.toISOString().slice(0, 10);
            groupingElement.innerHTML = '<h3>' + formattedDueDate + '</h3>';
            calendarContent.appendChild(groupingElement);
        }
        console.log(calendarContent)

        // Append assignment to the corresponding grouping element
        var assignmentElement = document.createElement('div');
        assignmentElement.innerHTML = assignmentName + ' (' + className + ')';
        groupingElement.appendChild(assignmentElement);

        // Sort assignments within the grouping element by due time
        var assignmentsInGroup = Array.from(groupingElement.querySelectorAll('.assignment'));
        assignmentsInGroup.sort(function(a, b) {
            var assignmentA = assignments.find(assign => assign.name === a.innerText);
            var assignmentB = assignments.find(assign => assign.name === b.innerText);
            return assignmentA.due - assignmentB.due;
        });

        assignmentsInGroup.forEach(function(assign) {
            groupingElement.appendChild(assign);
        });
    }

// Example usage
    addAssignment('Math Homework', '2023-07-06T09:00:00', 'Math Class');
    addAssignment('Science Project', '2023-07-06T14:30:00', 'Science Class');
    addAssignment('English Essay', '2023-07-06T11:00:00', 'English Class');
    addAssignment('History Project', '2023-07-10T13:00:00', 'History Class');

});
