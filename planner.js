/* 

    (c) Davis Haupt licensed under MIT license

*/

var boxClicked = "";

var sidebarDay = getNextSchoolDay(new Date());

var mode = "hw";
var modeDesc = "Day's agenda"

$(document).ready(function() {
    /* Initialization */

    ref.req = "sync"; // Not uploading anything, just getting the info to start the page.
    refresh();

    $(".period").each(function(index, value) {
        if (index != 0)  { // Jank fix again.
            var id = value.id.split('');
            var identifier = "#" + value.id;

            if (id[1] == 9 && isLab(value.id)) // only show Z period if there's a class then.
                $(identifier).hide();
            
            // Make the element reflect the user's schedule.
            $(identifier).children(".letter").html(getClass(value.id)); 
            $(identifier).css("background-color", ref.colors[ref.colorCode[id[0]][id[1]]]);
            // Hide elements that are only shown when clicked.
            $(identifier).children(".close").hide();
            $(identifier).children("textarea").hide();
        }
    });


    /* Event Listeners */
    // opening/closing textareas
    $(".letter").click(function() {
        periodID = $(this).attr("id");
        if (boxClicked == "") { // if no boxes are currently open
            boxClicked = periodID;
            $(this).parent().animate({"width": $(".period").width() + 30, "height": 200}); // enlarge the box

            $(this).slideUp(); // hide the title
            $(this).parent().children(".close").slideDown();
            // show the textarea
            $(this).parent().children("textarea").slideDown();
            $(this).parent().children("textarea").focus();
        }  

    });

    $(".close").children("a").click(function() { // when a box is closed
        if (boxClicked == periodID) { // just make sure 
            boxClicked = ""; // no more boxes are open
            
            // climbing up and down the tree to move things around.
            $(this).parent().slideUp();
            $(this).parent().parent().animate({"width": $(".period").width(), "height": 70});
            $(this).parent().parent().children("textarea").slideUp();
            $(this).parent().parent().children(".letter").slideDown();
            refreshSidebar(mode, sidebarDay);
            ref.assignments = save();

        }
    });

    // Selecting day for the sidebar
    $(".day").click(function() {
        if (mode == "hw"){ // could get jank if you're getting confused with filters.
            dayNum = parseInt($(this).attr("id").split('')[1]);
            sidebarDay = dayNum;
            refreshSidebar(mode, dayNum);
        }
    });


    $(".navBtn").click(function() {
        ref.req = this.id;
        var dir = 0;
        if (this.id=="prev")
            dir = 1;
        else if (this.id=="next")
            dir = -1;
        $(".schedule").slide(dir * $(document).width(), 200, function() {
            refresh();
        });
  

    });

    $("#filters").change(function() {
      mode = $(this).children("select option:selected").val();
      modeDesc = $(this).children("select option:selected").html();
      refreshSidebar(mode, sidebarDay);

    });

    // RESPONSIVE DESIGN
    $(window).resize(responsiveUpdate);
});



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

function refresh() {
    getRef();
    set(ref.assignments);
    refreshSidebar(mode, sidebarDay);
    responsiveUpdate();
}

function getRef() {
    // eventually, will send ref to server and get an updated object in return.
    var dir = 0;
    if (ref.req=="prev") {
        dir = -1;
        ref.assignments = ref.lastWeek;
    }
    else if (ref.req=="save" || ref.req=="sync") {
        dir = 0;
    }
    else if (ref.req=="next") {
        dir = 1;
        ref.assignments = ref.nextWeek;
    }

    ref.monday = new Date(ref.monday.getYear()+1900, ref.monday.getMonth(), ref.monday.getDate() + 7*dir);
}