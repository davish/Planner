
/* 
 ************************************
 *
 * Functions for the responsive grid.
 *
 ************************************
*/

var pWidth = ($(window).width() - 400) / 5;
/* 
    Insert the dates next to the day of the week, when the screen is wide enough.
*/
function insertDates(d) {
    d = new Date(d);
    $(".day").each(function(index, value) {
        var date = new Date(d.getYear()+1900, d.getMonth(), d.getDate() + index);
        var dString = (date.getMonth()+1) + "/" + date.getDate() + "/" + (date.getYear() % 100);
        $(value).html('<a href="#">' + $(value).children("a").html() + "</a> " + dString);
    });
}

function responsiveUpdate() {
    pWidth = ($(window).width() - 400) / 5; // width of one square

    if (pWidth < 76) // if the window's getting really small
        pWidth = 76;
    else if (pWidth > 140) // don't want it too big
        pWidth = 140;

    if (pWidth < 126) {
        $(".day").each(function(index, value) {
            $(value).html('<a href="#">' + $(value).children("a").html() + "</a>") // take off the date
        });
    } else {
        insertDates(ref.monday);
    }
    // adjust the dimensions
    $(".period").width(pWidth); 
    $(".sidebar").width(pWidth * 1.4);    
    $(".letter").css({"width": pWidth, "height": 70 - 25});
    
    $("#" + boxClicked).width(pWidth + 30);
    $(".close").css({"padding-left": pWidth + 15});

}