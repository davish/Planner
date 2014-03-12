/* 

    (c) Davis Haupt licensed under MIT license

*/

var boxClicked = "";

var sidebarDay = getNextSchoolDay(new Date());

var lastWidth = 0;

var mode = "hw";
var modeDesc = "Day's agenda"

var monday = new Date();


function main() {
    /* Initialization */
    responsiveUpdate();
    
    $(".sidebarContents").html("<h3>" + getDayName(sidebarDay) + "</h3>");
    insertDates();




    $(".period").each(function(index, value) {
        var id = value.id.split('');
        var identifier = "#" + value.id;
        if (id[1] == 9)
            $(identifier).hide();

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
            refreshSidebar(mode, sidebarDay);
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
      console.log(modeDesc);
      refreshSidebar(mode);

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
            $(value).html('<a href="#">' + $(value).children("a").html() + "</a>")
        });
    } else {
        insertDates();
    }
    // adjust the dimensions
    $(".period").width(pWidth); 
    $(".sidebar").width(pWidth * 1.4);    
    $(".letter").css({"width": pWidth, "height": 70 - 25});
    $(".close").css({"padding-left": pWidth + 15});
    
    $("#" + boxClicked).width(pWidth + 50);
}


function insertDates() {
    $(".day").each(function(index, value) {
        $(value).html('<a href="#">' + $(value).children("a").html() + "</a> " + (monday.getMonth()+1) + "/" + (monday.getDate()) + "/" + (monday.getYear() % 100))
    });
}

function refreshSidebar(f, d) {
    if (f != "hw")
        filterAssignments(f, modeDesc);
    else 
        checkForHW(d);
    
}

function checkForHW(day) {
    $(".sidebarContents").html("<h3>" + getDayName(day) + "</h3>"); // Heading
    for (var i = 1; i <= 9; i++ ) {
        if ($("#" + String(day) + String(i))) {
            var TAval = $("#" + String(day) + String(i)).children("textarea").val();
            if (TAval != "") {
                var lines = TAval.split('\n');
                var toDo = ""; // Lines to go onto the todo list
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j] != "") {
                        var line = lines[j];
                        for (var y = 0; y < keywords.length; y++) { // check for keywords 
                            if (line.contains(keywords[y])) {
                                line = '<span class="'+ keywords[y] +'">' + line + '</span>';
                                break;
                            }
                        }

                        toDo = toDo + "<li>" + line + "</li>";
                    }
                }
                $(".sidebarContents").append("<hr> <b>" + getClass(String(day) + String(i)) + " Period:</b> <ul>" + toDo + "</ul>")
            }
        }
        
    }
}


function filterAssignments(f, title) {
    f = f.toLocaleLowerCase();
    $(".sidebarContents").html("<h3>" + title + ":</h3>"); // Heading

    $(".period").each(function(index, value) {
        var TAval = $(value).children("textarea").val();
        var day = getDayName(parseInt(value.id.split('')[1]));
        var lines = TAval.split('\n');
        var toDo = ""; // Lines to go onto the todo list
        for (var j = 0; j < lines.length; j++) {
            if (lines[j].contains(f)) {
                var line = lines[j];
                line = '<span class="'+ f +'">' + line + '</span>';
                toDo = toDo + "<li>" + line + "</li>";
            }
        }
        if (toDo)
            $(".sidebarContents").append("<hr> <b>" + getClass(value.id) + " Period on " + day + ":</b> <ul>" + toDo + "</ul>")
    });

}


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

function getClass(s) {
    var class_ID = s.split('');
    return schedule[class_ID[0]][class_ID[1]];
}

function getNextSchoolDay(date) {
    var day = 0;
    if (date.getDay() > 0 && date.getDay() < 6)  // getDate() returns int 0-6 (sunday-saturday)
        day = date.getDay();
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