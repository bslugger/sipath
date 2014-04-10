function svgRemoveHighlightClass () {
    svgRemoveClass(this, 'highlighted');
}
function svgAddHighlightClass () {
    svgAddClass(this, 'highlighted');
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