/*
Copyright 2012 trinary.ru 
*/
trinary.calendar = {};
trinary.calendar.sign_names = { '+' : 'plus', '-' : 'minus', '0' : 'zero' };
trinary.calendar.signToName = function(sign) {
    return trinary.calendar.sign_names[sign];
};
trinary.calendar.formater = function (a, b, c) {
    a = trinary.core.decimalToTrinary(a);
    var name = a;
    if (c == true) {
        a = trinary.core.trinaryToNonary(a, 'lat');
    };
    if (typeof b != 'undefined') {
        a = trinary.core.align(a, b);
    };
    var out = [];
    symbols = a.split('');
    for (var i in symbols) {
        var s = symbols[i];
        out.push('<var class="'+trinary.calendar.signToName(s)+'">'+s+'</var>');
    };
    return out.join('');
};
trinary.calendar.formaterNonary = function (a, b) {
    if (typeof b != 'undefined') {
        b = 2
    }
    return trinary.calendar.formater(a, b, true)
};
trinary.calendar.renderMonth = function (a, m, c) {
    var i = locale.date.monthFullNames;
    var h = locale.date.dayShortNames;
    h = h.slice(1, 7).concat(h[0]);
    var out = '';
    var f = 6;
    var g = 0;
    var j = new Date(m + '/01/' + a);
    var k = j.getDay();
    out += '<div class="month ' + (m % 2 == 0 ? 'even' : 'odd') + '">';
    var l = c(m);
    out += '<div class="month-name">' + i[m-1] + '</div>';
    out += '<div class="day-names">';
    for (var d = 0; d < 7; d++) {
        var n = c(d + 1);
        var o = (d >= 5) ? ' holyday' : '';
        out += '<div class="day' + o + '">' + h[d] + '</div>'
    }
    out += '</div>';
    out += '<div class="week">';
    if (k == g) {
        k += 7
    }
    for (var d = g; d < (k - 1); d++) {
        out += '<div class="day of-prev-month"></div>'
    };
    for (var d = 1; d <= 31; d++) {
        j = new Date(m + '/' + d + '/' + a);
        if ((j.getMonth() + 1) > m) {
            break
        };
        k = j.getDay();
        var o = (k == 0 || k == 6) ? ' holyday' : '';
        out += '<div class="day' + o + '">';
        out += c(j.getDate(), 4);
        out += '</div>';
        if (k == g) {
            out += '</div><div class="week">';
        }
    };
    var p = new Date((m + 1) + '/01/' + a).getDay();
    if (k > 0) {
        for (var d = (k + 1); d <= 7; d++) {
            out += '<div class="day of-next-month"></div>';
        };
    };
    out += '</div>';
    out += '</div>';
    return out;
};
trinary.calendar.render = function (options) {
    var a, b, c;
    if (typeof options == 'undefined') { options = {}; };
    if (typeof options.year != 'number') {
        a = new Date().getFullYear();
    } else {
        a = options.year;
    };
    var c;
    if (options.system == 'nonary') {
        c = trinary.calendar.formaterNonary;
        b = 'nonary'
    } else {
        c = trinary.calendar.formater;
        b = 'trinary'
    }
    var out = '';    
    out += '<div class="calendar ' + b + (typeof options.style == 'undefined' ? '' : ' ' + options.style) +'">';
    out += '<div class="year"><h2>' + c(a) + '</h2></div>';
    for (var m = 1; m <= 12; m++) {
        out += trinary.calendar.renderMonth(a, m, c);
    };
    out += '</div>';
    return out;
};