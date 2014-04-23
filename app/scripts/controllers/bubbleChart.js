'use strict';

angular.module('a3App')
  .controller('BubbleChartCtrl', function ($scope, pathVizService, courseAlumniViewService) {
    $scope.svg = {
        width: 400,
        height: 1700
    };
    $scope.courseData = pathVizService.courseData;
    $scope.alumniData = pathVizService.alumniData;

    $scope.selectCourse = function (course) {
        pathVizService.clearSelectedCourses();
        pathVizService.selectCourse(course);
    }

    $scope.highlightPath = pathVizService.highlightPath;
    $scope.unhighlightPath = pathVizService.unhighlightPath;
    $scope.shouldDisplayBubbleView = courseAlumniViewService.shouldDisplayBubbleView;
    $scope.selectedAlumni = courseAlumniViewService.selectedAlumni;

    /* View switching event handler */

    $scope.onOverviewClicked = courseAlumniViewService.displayBubbleView;
  });
