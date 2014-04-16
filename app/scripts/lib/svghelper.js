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

function svgCoords2path(coords) {
    var pathCoords = [];
    for (var i = 0; i < coords.length; i++) {
      pathCoords.push(coords[i].x + ' ' + coords[i].y);
    }
    return 'M ' + pathCoords.join(' L ');
}
function moveNodeToGroup(objArr, groupID) {
    var newParent = document.getElementById(groupID);
    for (var i = 0; i < objArr.length; i++) {
        var obj = objArr[i];
        newParent.appendChild(obj);
        obj.parentElement.removeChils(obj);
    }
}

// definition of position
function svgSankeyPath(startX, startY, endX, endY, startWidth, endWidth, xScale, yScale, turnWeight, curveWeight, xOffset, yOffset) {
    var ydiff = endY - startY;
    var absYdiff = Math.abs(ydiff);
    var turnPer = turnWeight * ( 1 - absYdiff);

    var cmds = [];
    // Move to start point 
    cmds.push("M" + startX + "," + (startY * yScale + yOffset));
    // Upper Curve
    if (ydiff !== 0) {
        // short stright line
        cmds.push("l" + (turnPer * xScale) + "," + 0);
        // double curve line
        cmds.push("c" + curveWeight + "," + 0 + 
        " " + ((1 - 2 * turnPer) * xScale - curveWeight) + "," + (ydiff * yScale) + " " + ((1 - 2 * turnPer) * xScale) + "," + (ydiff * yScale));
        // short stright line
        cmds.push("l" + (turnPer * xScale) + ",0 ");
    } else {
        // just straight line
        cmds.push("L" + endX + "," + (endY * yScale + yOffset));
    }

    // line width
    cmds.push("l" + 0 + "," + (endWidth * yScale));

    // bottom curve
    if (ydiff !== 0) {
        // short straight line
        cmds.push("l" + (-turnPer * xScale) + "," + 0);
        // double curve line
        cmds.push("c" + -curveWeight + "," + 0 + " " + (curveWeight - (1 - 2 * turnPer) * xScale) + "," + (-ydiff * yScale) + " " + -((1 - 2 * turnPer) * xScale) + "," + (-ydiff * yScale));
        // short straight line
        cmds.push("l" + (-turnPer * xScale) + "," + 0);
        
    } else {
        // just straight line
        cmds.push("L" + startX + "," + ((startY + startWidth) * yScale + yOffset));
    }

    // close the path
    cmds.push("z");
    return cmds.join(" ");

}

/**
 *  Math Util
 */
// not correct but usable right now
function roundTo (input, point) {
    if (typeof point === 'undefined') {
        point = 0;
    }
    var roundMul = Math.pow(10, point);
    return Math.round(input * roundMul) / roundMul;
}

(function (window) {
    var last = +new Date();
    var delay = 100; // default delay

    // Manage event queue
    var stack = [];

    function callback() {
        var now = +new Date();
        if (now - last > delay) {
            for (var i = 0; i < stack.length; i++) {
                stack[i]();
            }
            last = now;
        }
    }

    // Public interface
    var onDomChange = function (fn, newdelay) {
        if (newdelay) delay = newdelay;
        stack.push(fn);
    };

    // Naive approach for compatibility
    function naive() {

        var last = document.getElementsByTagName('*');
        var lastlen = last.length;
        var timer = setTimeout(function check() {

            // get current state of the document
            var current = document.getElementsByTagName('*');
            var len = current.length;

            // if the length is different
            // it's fairly obvious
            if (len != lastlen) {
                // just make sure the loop finishes early
                last = [];
            }

            // go check every element in order
            for (var i = 0; i < len; i++) {
                if (current[i] !== last[i]) {
                    callback();
                    last = current;
                    lastlen = len;
                    break;
                }
            }

            // over, and over, and over again
            setTimeout(check, delay);

        }, delay);
    }

    //
    //  Check for mutation events support
    //

    var support = {};

    var el = document.documentElement;
    var remain = 3;

    // callback for the tests
    function decide() {
        if (support.DOMNodeInserted) {
            window.addEventListener("DOMContentLoaded", function () {
                if (support.DOMSubtreeModified) { // for FF 3+, Chrome
                    el.addEventListener('DOMSubtreeModified', callback, false);
                } else { // for FF 2, Safari, Opera 9.6+
                    el.addEventListener('DOMNodeInserted', callback, false);
                    el.addEventListener('DOMNodeRemoved', callback, false);
                }
            }, false);
        } else if (document.onpropertychange) { // for IE 5.5+
            document.onpropertychange = callback;
        } else { // fallback
            naive();
        }
    }

    // checks a particular event
    function test(event) {
        el.addEventListener(event, function fn() {
            support[event] = true;
            el.removeEventListener(event, fn, false);
            if (--remain === 0) decide();
        }, false);
    }

    // attach test events
    if (window.addEventListener) {
        test('DOMSubtreeModified');
        test('DOMNodeInserted');
        test('DOMNodeRemoved');
    } else {
        decide();
    }

    // do the dummy test
    var dummy = document.createElement("div");
    el.appendChild(dummy);
    el.removeChild(dummy);

    // expose
    window.onDomChange = onDomChange;
})(window);
Usage