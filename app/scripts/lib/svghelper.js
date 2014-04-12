function svgRemoveHighlightClass () {
    svgRemoveClass(this, 'highlighted');
}
function svgAddHighlightClass () {
    //if (!this.hasClass('highlighted')) {
        svgAddClass(this, 'highlighted');
    //}
}

function svgAddClass (element, keyword) {
    var oldClass = $(element).attr('class');
    $(element).attr('class', oldClass + ' ' + keyword);
}

function svgRemoveClass (element, keyword) {
    var oldClass = $(element).attr('class');
    var target = ' ' + keyword;
    if (oldClass.indexOf(target) != -1) {
        $(element).attr('class', oldClass.replace(target, ''));
    }
}

// not correct but usable right now
function roundTo (input, point) {
    if (typeof point === 'undefined') {
        point = 0;
    }
    var roundMul = Math.pow(10, point);
    return Math.round(input * roundMul) / roundMul;
}