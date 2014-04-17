'use strict';

angular.module('a3App')
  .controller('PathBarCtrl', function ($scope, pathVizService) {
    $scope.selectedBgName = pathVizService.selectedBgName;
    $scope.selectedPosName = pathVizService.selectedPosName;
    $scope.expanded = false;
    $scope.toggle = function () {
        $scope.expanded = !$scope.expanded;
    }
  });
