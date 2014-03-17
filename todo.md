x RESPONSIVE DESIGN
	x make it so when the window is smaller, the assignment boxes get smaller, the text gets smaller, so the sidebar doesn't go onto the next line under the schedule. After a while, obviously, you get the mobile version, with a drop-down for the day and a list of all your classes, very Planner R2-style.
	x Should be easy with JS, probably a jQuery event handler for when the window's resizing, ($.resize() does exist) then all you have to do is change the CSS on the .period class for shorter width, and then hide everything and show the mobile site at a certain point. EASY PEASY

\- MOBILE SITE
	\- Do later

x add styling for tests and quizzes, and long-term assignments (keywords: 'test', 'quiz', and 'due', respectively)
	x use <span> elements
x add filters, so only tests show up, etc.
	\- e.g. see your tests for the week, your assessments for the week, etc.

x add dates next to the day.

x sanitize the HTML
x convert the TA to a JSON so it can be sent to the server when the time comes.


x hard-code my schedule in there for a proof-of-concept of how the system differentiates labs from classes
	x If a period name is 1-letter, then it's a lab.
	x Only hide Z period if it's a lab.
	x implement regex usage
	x add filter for labs with teachers
x ability to add keywords for the three different categories
	\- Make frontend for this capability.

\- animation for next/previous week
	\- dummy function for AJAX which returns a "new" 'ref' object.

\- comment and clean up… a lot!