'use strict';

angular.module('a3App')
  .controller('BubbleChartCtrl', function ($scope, pathVizService) {
    $scope.svg = {
        width: 800,
        height: 600
    };
    $scope.courseData = pathVizService.courseData;
    $scope.alumniData = pathVizService.alumniData;
    $scope.selectedAlumni = [];

    $scope.highlightPath = function (alumnus) {
        $scope.selectedAlumni.push(alumnus.id);
        alumnus.selected = true;
    }

    $scope.unhighlightPath = function (alumnus) {
        if ($scope.selectedAlumni.indexOf(alumnus) >= 0) {
            $scope.selectedAlumni.splice(alumnus.id, 1);
        }
        alumnus.selected = false;
    }

    $scope.moveAlumniCoords = function () {
        // console.log('coord scroll');
        var top = jQuery('.list-container').scrollTop();
        angular.forEach($scope.alumniData, function (alumnus, index) {
            alumnus.coord.y = alumnus.coord.originalY - top;
            if ((alumnus.coord.y > 100) || (alumnus.coord.y < -100)) {
                alumnus.hidden = true;
            }
            else
                alumnus.hidden = false;
        });
        jQuery('svg').children.each(function(child) {
            jQuery('svg')[0].appendChild(this);
        });
    }

  });
