/* 

    (c) Davis Haupt licensed under MIT license

*/

var boxClicked = "";

var sidebarDay = getNextSchoolDay(new Date());

var lastWidth = 0;

var mode = "hw";
var modeDesc = "Day's agenda"

var monday = new Date(2014, 2, 10); // placeholder

var assignments = {11: "JERGENS", 12: "test", 13: "", 14: "", 15: "", 16: "", 17: "", 18: "", 19: "", 21: "", 22: "side lard: jiggling!", 23: "", 24: "", 25: "", 26: "", 27: "", 28: "", 29: "", 31: "", 32: "", 33: "", 34: "smesmesme", 35: "test j period", 36: "", 37: "", 38: "", 39: "", 41: "", 42: "", 43: "", 44: "quiz", 45: "mass decreasing!", 46: "", 47: "", 48: "", 49: "", 51: "", 52: "", 53: "", 54: "", 55: "", 56: "", 57: "", 58: "", 59: "", 00: undefined};

function main() {
    /* Initialization */
    set(assignments);
    refreshSidebar(mode, sidebarDay); // set the sidebar
    responsiveUpdate(); // update the widths of everything, and insert dates.

    $(".period").each(function(index, value) {
        if (index != 0)  { // Jank fix again.
            var id = value.id.split('');
            var identifier = "#" + value.id;

            if (id[1] == 9 && schedule[id[0]][id[1]].length == 1) {
                $(identifier).hide();
                console.log(schedule[id[0]][id[1]]);
            }

            $(identifier).children(".letter").html(schedule[id[0]][id[1]]);
            $(identifier).children(".close").hide();
            $(identifier).children("textarea").hide();
            $(identifier).css("background-color", colors[colorCode[id[0]][id[1]]]);
        }
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
            refreshSidebar(mode, sidebarDay);
            assignments = save();

        }
    });

    // Selecting day for the sidebar
    $(".day").click(function() {
        dayNum = parseInt($(this).attr("id").split('')[1]);
        sidebarDay = dayNum;
        mode = "hw";
        refreshSidebar(mode, dayNum);
    });

    $("#filters").change(function() {
      mode = $(this).children("select option:selected").val();
      modeDesc = $(this).children("select option:selected").html();
      refreshSidebar(mode, sidebarDay);

    });

    // RESPONSIVE DESIGN
    $(window).resize(responsiveUpdate);
}

function responsiveUpdate() {
    var pWidth = ($(window).width() - 400) / 5; // width of one square

    if (pWidth < 70) // if the window's getting really small
        pWidth = 70;
    else if (pWidth > 140) // don't want it too big
        pWidth = 140;

    if (pWidth < 126) {
        $(".day").each(function(index, value) {
            $(value).html('<a href="#">' + $(value).children("a").html() + "</a>") // take off the date
        });
    } else {
        insertDates(monday);
    }
    // adjust the dimensions
    $(".period").width(pWidth); 
    $(".sidebar").width(pWidth * 1.4);    
    $(".letter").css({"width": pWidth, "height": 70 - 25});
    $(".close").css({"padding-left": pWidth + 15});
    
}

/*
    Save the contents of the planner to an object, for transfer to the server via JSON.
*/
function save() {
    var asn = {};
    $(".period").each(function(index, value) {
        if (index != 0) // more of that jank fix
            asn[value.id] = $(value).children("textarea").val();
    });
    return asn;

}

/* 
    set the contents of the planner based on the given object.
*/
function set(o) {
    $(".period").each(function(index, value) {
        $(value).children("textarea").val(o[value.id]);
    });
}


/* 
    Insert the dates next to the day of the week, when the screen is wide enough.
*/
function insertDates(d) {
    $(".day").each(function(index, value) {
        var date = new Date(d.getYear()+1900, d.getMonth(), d.getDate() + index);
        var dString = (date.getMonth()+1) + "/" + date.getDate() + "/" + (date.getYear() % 100);
        $(value).html('<a href="#">' + $(value).children("a").html() + "</a> " + dString);
    });
}

/* 
    update the sidebar contents, based on the current filtering mode.
*/
function refreshSidebar(f, d) {
    if (f != "hw")
        filterAssignments(f, modeDesc);
    else 
        checkForHW(d);
    
}

/* 
    Check the contents of a column and put it in the sidbar.
*/
function checkForHW(day) {
    $(".sidebarContents").html("<h3>" + getDayName(day) + "</h3>"); // Heading
    for (var i = 1; i <= 9; i++ ) { // Loop through one column
        var lines = $("#" + String(day) + String(i)).children("textarea").val().split('\n'); // split the TA into lines
        var toDo = ""; // Lines to go onto the todo list
        for (var j = 0; j < lines.length; j++) { // only lines with content go on the todo list
            if (lines[j] != "") {
                var line = lines[j].escapeHTML(); // remember to escape! don't want forms 
                
                for (var y = 0; y < keywords.length; y++) { // check for keywords 
                    if (line.contains(keywords[y])) {
                        line = '<span class="'+ keywords[y] +'">' + line + '</span>';
                        break;
                    }
                }

                toDo = toDo + "<li>" + line + "</li>";
            }
        }

        var title = "";
        if (getClass(String(day) + String(i)).length <= 1)
            title = getClass(String(day) + String(i)) + " Period";
        else
            title = getClass(String(day) + String(i));

        if (toDo) // if there's anything actually to append
            $(".sidebarContents").append("<hr> <b>" + title +":</b> <ul>" + toDo + "</ul>");
        
        
    }
}

/* 
    Check the entire week for lines containing a specific keyword.
*/
function filterAssignments(f, title) {
    f = f.toLocaleLowerCase();
    $(".sidebarContents").html("<h3>" + title + ":</h3>"); // Heading

    $(".period").each(function(index, value) {
        if (index != 0) { // part of the jank solution
            var TAval = $(value).children("textarea").val();
            var day = getDayName(parseInt(value.id.split('')[0]));
            var lines = TAval.split('\n');
            var toDo = ""; // Lines to go onto the todo list
            for (var j = 0; j < lines.length; j++) {
                if (lines[j].toLocaleLowerCase().contains(f)) {
                    var line = lines[j];
                    line = '<span class="'+ f +'">' + line + '</span>';
                    toDo = toDo + "<li>" + line + "</li>";
                }
            }
            if (toDo)
                $(".sidebarContents").append("<hr> <b>" + getClass(value.id) + " Period on " + day + ":</b> <ul>" + toDo + "</ul>")
        }
    });

}

/*
    returns true if the given word is in the string.
*/
String.prototype.contains = function(w) {
    // look for word w in string
    a = this.split(' ');
    for (var i = 0; i < a.length; i++) {
        if (a[i].toLocaleLowerCase() === w.toLocaleLowerCase()) {
            return true;
        }
    }
    return false;
};

String.prototype.escapeHTML = function() {
    return $('<div/>').text(this).html();
};

/*
    returns the class name given the coordinates in the schedule object.
*/
function getClass(s) {
    var class_ID = s.split('');
    return schedule[class_ID[0]][class_ID[1]];
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

