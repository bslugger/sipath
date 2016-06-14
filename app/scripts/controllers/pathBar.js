'use strict';

angular.module('a3App')
  .controller('PathBarCtrl', function ($scope, pathVizService, courseAlumniViewService) {
    $scope.selectedBgName = pathVizService.selectedBgName;
    $scope.selectedPosName = pathVizService.selectedPosName;
    $scope.isSankeySelected = pathVizService.isSankeySelected;
    $scope.expanded = true;
    $scope.toggle = function () {
        if (courseAlumniViewService.shouldShowAlumniBar.value) {
            courseAlumniViewService.toggleAlumniBar();
        }
        pathVizService.filterAlumni();
        courseAlumniViewService.updateCourseRadius();
        courseAlumniViewService.displayBubbleView();


        $scope.expanded = !$scope.expanded;
    }
  });
