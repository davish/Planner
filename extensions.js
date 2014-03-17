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


$.fn.slide = function(dist, t) {
    var element = this[0];
    var p = $(element).css("position");
    $(element).css("position", "relative");
    if (!t)
        t = 500
    $(element).animate({
        left: "+=" + dist
    }, t, function() {
        $(element).animate({left: 0}, 0);
    });
    $(element).css("position", p);
}
