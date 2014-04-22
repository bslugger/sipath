'use strict';

angular.module('a3App')
  .controller('AlumniBarCtrl', function ($scope, pathVizService, courseAlumniViewService) {
    $scope.alumniData = pathVizService.alumniData;
    $scope.highlightPath = pathVizService.highlightPath;
    $scope.unhighlightPath = pathVizService.unhighlightPath;

    $scope.onAlumnusClicked = courseAlumniViewService.displayAlumniView;

    /* Search Function */
    $scope.filterTextChange = function(filterText) {
        var filterTextArr = filterText.split(" ");
        for (var i = 0; i < $scope.alumniData.length; i++) {
            var alumni = $scope.alumniData[i];
            var hasCount = 0;
            if (filterText !== "") {
                for (var j = 0; j < filterTextArr.length; j++) {
                    var filter = filterTextArr[j];
                    var patt = new RegExp(filter, "i");
                    if (patt.test(alumni.name)) {
                        hasCount++;
                        continue;
                    } else if (patt.test(alumni.position)) {
                        hasCount++;
                        continue;
                    }
                }
                if (hasCount >= filterTextArr.length) {
                    alumni.searchResult = true;
                } else {
                    alumni.searchResult = false;
                }
            } else {
                alumni.searchResult = true;
            }
        }
    }

    $scope.moveAlumniCoords = function () {
        var top = jQuery('.list-container').scrollTop();
        angular.forEach($scope.alumniData, function (alumnus, index) {
            alumnus.coord.y = alumnus.coord.originalY - top;
            if ((alumnus.coord.y > 560) || (alumnus.coord.y < -100)) {
                alumnus.hidden = true;
            }
            else
                alumnus.hidden = false;
        });
        pathVizService.updateAlumniPath();
    }
  });
