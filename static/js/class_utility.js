/* 
 ************************************
 *
 * Utility classes for the schedule
 * Object.
 *
 ************************************
*/

function isLab(c) {
    return getClass(c).length <=1;
}

/*
    returns the class name given the coordinates in the schedule object.
*/
function getClass(s) {
    var class_ID = s.split('');
    return settings.schedule[class_ID[0]][class_ID[1]];
}

/* 
    Get the next schoolday, given a date object.
*/
function getNextSchoolDay(date) {
    var day = 0;
    if (date.getDay() > 0 && date.getDay() < 6)  // getDate() returns int 0-6 (sunday-saturday)
        day = date.getDay();
    else // if it's a weekend
        day = 1; // Monday's the next schoolday
    return day;
}

/*
    get the string with the name of the day given its numeric value.
*/
function getDayName(d) {
    var s = ""
    switch(d) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "You Suck";
    }
}