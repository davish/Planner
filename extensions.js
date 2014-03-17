/* 
 ************************************
 *
 * Extending existing classes
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
    if (!t)
        t = 500
    $(element).animate({
        left: "+=" + dist
    }, t, function() {
        $(element).animate({left: 0}, 0);
    });
}
