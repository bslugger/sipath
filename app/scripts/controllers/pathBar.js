'use strict';

angular.module('a3App')
  .controller('PathBarCtrl', function ($scope, pathVizService) {
    $scope.selectedBgName = pathVizService.selectedBgName;
    $scope.selectedPosName = pathVizService.selectedPosName;
    $scope.expanded = true;
    $scope.toggle = function () {
        pathVizService.filterAlumni();
        $scope.expanded = !$scope.expanded;
    }
  });
