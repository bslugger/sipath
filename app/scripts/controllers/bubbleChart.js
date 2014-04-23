'use strict';

angular.module('a3App')
  .controller('BubbleChartCtrl', function ($scope, pathVizService, courseAlumniViewService) {
    $scope.svg = courseAlumniViewService.svg;
    $scope.courseData = pathVizService.courseData;
    $scope.alumniData = pathVizService.alumniData;

    $scope.selectCourse = function (course) {
        pathVizService.clearSelectedCourses();
        pathVizService.selectCourse(course);
    }

    $scope.highlightPath = pathVizService.highlightPath;
    $scope.unhighlightPath = pathVizService.unhighlightPath;
    $scope.isAnyAlumnushighlighted = pathVizService.isAnyAlumnushighlighted;
    $scope.shouldDisplayBubbleView = courseAlumniViewService.shouldDisplayBubbleView;
    $scope.selectedAlumni = courseAlumniViewService.selectedAlumni;

    $scope.hoverCourse = function (course) {
        course.isHovered = true;
    }

    $scope.unhoverCourse = function (course) {
        course.isHovered = false;
    }

    $scope.onOverviewClicked = courseAlumniViewService.displayBubbleView;
  });
