/* 

    (c) Davis Haupt licensed under MIT license

*/

var colors = {
                "A": "#00ff00",
                "B": "#ff0080",
                "C": "#029af5",
                "D": "#d75000",
                "E": "#ffd500",
                "F": "#00ffd5",
                "G": "#bc33ff",
                "H": "#5d5dfa",
                "I": "#12e29d",
                "J": "red",
                "K": "a7a7a7"

              }

var schedule = {
                    "1": {
                        "1": "B",
                        "2": "A",
                        "3": "E",
                        "4": "F",
                        "5": "I",
                        "6": "K",
                        "7": "H",
                        "8": "G"
                    },
                    "2": {
                        "1": "C",
                        "2": "D",
                        "3": "H",
                        "4": "G",
                        "5": "I",
                        "6": "K",
                        "7": "B",
                        "8": "A"
                    },
                    "3": {
                        "1": "E",
                        "2": "F",
                        "3": "H",
                        "4": "G",
                        "5": "J",
                        "6": "K",
                        "7": "D",
                        "8": "C"
                    },
                    "4": {
                        "1": "B",
                        "2": "A",
                        "3": "D",
                        "4": "C",
                        "5": "I",
                        "6": "K",
                        "7": "E",
                        "8": "F"
                    },
                    "5": {
                        "1": "E",
                        "2": "F",
                        "3": "A",
                        "4": "B",
                        "5": "I",
                        "6": "K",
                        "7": "G",
                        "8": "H"
                    }
                }
var boxClicked = "";

var sidebarDay = getNextSchoolDay(new Date());

var lastWidth = 0;

function main() {
    /* Initialization */

    $(".sidebar").html("<h3>" + getDayName(getNextSchoolDay(new Date())) + "</h3>");


    /* Responsive Elements */
    responsiveUpdate();

    $(".period").each(function(index, value) {
        var id = value.id.split('');
        var identifier = "#" + value.id;
        $(identifier).children(".letter").html(schedule[id[0]][id[1]]);
        $(identifier).children(".close").hide();
        $(identifier).children("textarea").hide();
        $(identifier).css("background-color", colors[schedule[id[0]][id[1]]]);
    });


    /* Event Listeners */
    // opening/closing textareas
    $(".letter").click(function() {
        periodID = $(this).attr("id");
        if (boxClicked == "") {
            boxClicked = periodID;
            $(this).parent().animate({"width": $(".period").width() + 30, "height": 200});

            $(this).slideUp();
            $(this).parent().children(".close").slideDown();
            $(this).parent().children("textarea").slideDown();
            $(this).parent().children("textarea").focus();
        }  

    });

    $(".close").children("a").click(function() {
        if (boxClicked == periodID) {
            boxClicked = "";

            $(this).parent().slideUp();
            $(this).parent().parent().animate({"width": $(".period").width(), "height": 70});
            $(this).parent().parent().children("textarea").slideUp();
            $(this).parent().parent().children(".letter").slideDown();

            checkForHW(sidebarDay);
        }
    });

    // Selecting day for the sidebar
    $(".day").click(function() {
        dayNum = parseInt($(this).attr("id").split('')[1]);
        sidebarDay = dayNum;
        checkForHW(dayNum);
    });

    // RESPONSIVE DESIGN
    $(window).resize(responsiveUpdate);
}

function responsiveUpdate() {
    var pWidth = ($(window).width() - 500) / 5; // width of one square

    if (pWidth < 70) // if the window's getting really small
        pWidth = 70;
    else if (pWidth > 140) // don't want it too big
        pWidth = 140;

    // adjust the dimensions
    $(".period").width(pWidth); 
    $(".sidebar").width(pWidth * 1.4);    
    $(".letter").css({"width": pWidth, "height": 70 - 25});
    $(".close").css({"padding-left": pWidth + 15});
    
    $("#" + boxClicked).width(pWidth + 50);
}


function checkForHW(day) {
    $(".sidebar").html("<h3>" + getDayName(day) + "</h3>"); // Heading
    for (var i = 1; i <= 8; i++ ) {
        var TAval = $("#" + String(day) + String(i)).children("textarea").val();
        if (TAval != "") {
            var lines = TAval.split('\n');
            var toDo = ""; // Lines to go onto the todo list
            for (var j = 0; j < lines.length; j++) {
                if (lines[j] != "") {
                    toDo = toDo + "<li>" + lines[j] + "</li>";
                }
            }

            $(".sidebar").html($(".sidebar").html() + "<hr> <b>" + getClass(String(day) + String(i)) + " Period:</b> <ul>" + toDo + "</ul>");
        }
        
    }
}

function getClass(s) {
    var class_ID = s.split('');
    return schedule[class_ID[0]][class_ID[1]];
}

function getNextSchoolDay(date) {
    var day = 0;
    if (date.getDay() > 0 && date.getDay() < 5)  // getDate() returns int 0-6 (sunday-saturday)
        day = date.getDay() + 1;
    else // if it's a weekend
        day = 1; // Monday's the next schoolday
    return day;
}

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