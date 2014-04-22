'use strict';

angular.module('a3App')
  .controller('CoursePathCtrl', function ($scope, courseAlumniViewService) {
    $scope.shouldDisplayBubbleView = courseAlumniViewService.shouldDisplayBubbleView;
  });
