/* 
 ************************************
 *
 * Functions relating to the sidebar
 * And its contents.
 *
 ************************************
*/


/* 
    update the sidebar contents, based on the current filtering mode.
*/
function refreshSidebar(f, d) {
    if (f == "hw")
        checkForHW(d);
    else if (f == "currentEvents")
        checkEvents();
    else 
        filterAssignments(f, modeDesc);
    
}

/* 
    Check the contents of a column and put it in the sidbar.
*/
function checkForHW(day) {
    $(".sidebarContents").html("<h3>" + getDayName(day) + "</h3>"); // Heading
    for (var i = 1; i <= 9; i++ ) { // Loop through one column

        var cellID = String(day) + String(i);
        var lines = $("#" + cellID).children("textarea").val().matchOrNot(/[^\n]+/);

        var toDo = ""; // Lines to go onto the todo list
        for (var j = 0; j < lines.length; j++) { // only lines with content go on the todo list
            var line = lines[j].escapeHTML(); // remember to escape! don't want forms 
            var filterMatch = line.matchOrNot(ref.keywords);

            var lookForLab = isLab(cellID) && filterMatch[1]=="with";
            var lookForClass = filterMatch[1] != "with";

            if (filterMatch[1] && (lookForLab || lookForClass))
                line = '<span class="'+ ref.kwStyle[filterMatch[1].toLocaleLowerCase()] +'">' + line + '</span>';
            toDo = toDo + "<li>" + line + "</li>";     
        }
        var title = "";
        if (isLab(cellID))
            title = getClass(cellID) + " Period";
        else
            title = getClass(cellID);
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
        if (index != 0) {
            var day = getDayName(parseInt(value.id.split('')[0]));
            var lines = $(value).children("textarea").val().matchOrNot(/[^\n]+/);
            var toDo = ""; // Lines to go onto the todo list
            for (var j = 0; j < lines.length; j++) {
                var m = lines[j].matchOrNot(ref.keywords);
                if (m[1]) {
                    if (ref.kwStyle[m[1].toLocaleLowerCase()] == f)
                        toDo = toDo + '<li><span class="' + ref.kwStyle[m[1].toLocaleLowerCase()] + '">' + lines[j] + "</span></li>";
                }
            }

            var title = "";
            if (isLab(value.id))
                title = getClass(value.id) + " Period";
            else
                title = getClass(value.id);            

            if (toDo)
                $(".sidebarContents").append("<hr> <b>" + title + " on " + day + ":</b> <ul>" + toDo + "</ul>")
        }
    });

}

/* 
    Check for current events from the array in the ref object for this week.
*/
function checkEvents() {
    $(".sidebarContents").html("<h3>" + "Upcoming Events" + ":</h3>"); // Heading
    for (var i = 0; i < ref.currentEvents.length; i++) {
        var daysEvents = ref.currentEvents[i];
        toDo = "";
        if (daysEvents){
            for (var j = 0; j < daysEvents.length; j++) {
                toDo = toDo + '<li>' + daysEvents[j] + '</li>'
            }
        }
        if (toDo)
            $(".sidebarContents").append("<hr><b>" + getDayName(i+1) + ":</b> <ul>" + toDo + "</ul>");
    }
}