'use strict';

angular.module('a3App')
  .controller('CourseInfoCtrl', function ($scope, pathVizService, courseAlumniViewService) {
    $scope.courseData = pathVizService.courseData;
    $scope.selectedCourses = pathVizService.selectedCourses;
    $scope.isCourseSelected = pathVizService.isCourseSelected;
    $scope.legendScale1 = courseAlumniViewService.legendScale1;
    $scope.legendScale2 = courseAlumniViewService.legendScale2;
  });
