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

// definition of position is not integrated right now
function svgSankeyPath(startX, startY, endX, endY, startWidth, endWidth, xScale, yScale, turnWeight, curveWeight, xOffset, yOffset) {
    var ydiff = endY - startY;
    var absYdiff = Math.abs(ydiff);
    var turnPer = turnWeight * ( 1 - absYdiff);

    var cmds = [];
    // Move to start point 
    cmds.push("M" + startX + "," + (startY * yScale + 30));
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