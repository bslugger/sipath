'use strict';

angular.module('a3App')
  .controller('ScrollbarCtrl', function ($scope) {
    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    console.warn(scrollbarWidth); // Mac:  15

    // Delete the DIV 
    document.body.removeChild(scrollDiv);

    var origPadding = parseInt($("div.scrollbar-wrapper .content").css("padding-right").replace("px", ""));
    console.log(origPadding);//$("div.scrollbar-wrapper .content").css("padding-top"));
    $("div.scrollbar-wrapper .content").css("padding-right", (origPadding + scrollbarWidth) + "px");
  });
