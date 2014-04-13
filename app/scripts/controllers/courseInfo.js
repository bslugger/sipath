'use strict';

angular.module('a3App')
  .controller('CourseInfoCtrl', function ($scope, pathVizService) {
    $scope.courseData = pathVizService.courseData;
    $scope.selectedCourses = pathVizService.selectedCourses;
    $scope.isCourseSelected = pathVizService.isCourseSelected;
  });
