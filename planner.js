/* 

    (c) Davis Haupt licensed under MIT license

*/

var boxClicked = "";

var sidebarDay = getNextSchoolDay(new Date());

var mode = "hw";
var modeDesc = "Day's agenda"

$(document).ready(function() {
    /* Initialization */
    set(ref.assignments);
    refreshSidebar(mode, sidebarDay); // set the sidebar
    responsiveUpdate(); // update the widths of everything, and insert dates.

    $(".period").each(function(index, value) {
        if (index != 0)  { // Jank fix again.
            var id = value.id.split('');
            var identifier = "#" + value.id;

            if (id[1] == 9 && getClass(value.id).length == 1)
                $(identifier).hide();
            
            $(identifier).children(".letter").html(getClass(value.id));
            $(identifier).children(".close").hide();
            $(identifier).children("textarea").hide();
            $(identifier).css("background-color", ref.colors[ref.colorCode[id[0]][id[1]]]);
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
            ref.assignments = save();

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


