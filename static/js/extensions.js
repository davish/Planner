/* 
 ************************************
 *
 * Extentions of existing classes
 *
 ************************************
*/


String.prototype.matchOrNot = function(r) {
    var m = this.match(r);
    if (!m)
        m = []
    return m;
}

String.prototype.escapeHTML = function() {
    return $('<div/>').text(this).html();
};


$.fn.slide = function(dist, t, c) {
    var element = this[0];
    var p = $(element).css("position");
    $(element).css("position", "relative");
    if (!t)
        t = 500
    $(element).animate({
        left: "+=" + dist
    }, t, function() {
        $(element).css({left: -dist});
        $(element).animate({left: 0}, t);
        if (c)
            c();
    });
    $(element).css("position", p);
}
