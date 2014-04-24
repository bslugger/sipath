'use strict';

angular.module('a3App')
  .controller('ScrollbarCtrl', function ($scope) {
    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Delete the DIV 
    document.body.removeChild(scrollDiv);

    var origPadding = parseInt($("div.scrollbar-wrapper .content").css("padding-right").replace("px", ""));

    $("div.scrollbar-wrapper .content").css("padding-right", (origPadding + scrollbarWidth) + "px");

    // prevent highlight dragging from scrolling the wrapper div (thereby displaying the bars)
    $("div.scrollbar-wrapper").scroll(function() {
        this.scrollLeft = 0;
        this.scrollTop = 0;
    });

    $("div.scrollbar-wrapper .content").scroll(function() {
        // update custom scrollbar display using this.scrollTop as a percentage of this.clientHeight
        // alert("Place slider at " + ((100 * this.scrollTop) / this.clientHeight) + "%!");
    });
  });
