'use strict';

angular.module('a3App')
  .controller('PathBarCtrl', function ($scope, pathVizService) {
    $scope.selectedBgName = "Art & Design";
    $scope.selectedPosName = "Designer";
    $scope.expanded = false;
    $scope.toggle = function () {
        console.log('toggle');
        $scope.expanded = !$scope.expanded;
    }
  });
