'use strict';

angular.module('a3App')
  .controller('BubbleChartCtrl', function ($scope, pathVizService) {
    $scope.svg = {
        width: 800,
        height: 1200
    };
    $scope.courseData = [];
    $scope.alumniData = [];
    $scope.selectedAlumni = [];
    $scope.onCourseDataLoaded = function (data) {
        angular.forEach(data, function (row, index) {
            // Skip header
            if (index === 0)
                return;
            $scope.courseData.push({
                id: row[0],
                number: row[1],
                name: row[2],
                coord: {x: row[0]/3 * 100, y: index%3 * 100},
                popularity: row[3]
            });
        });
        console.log($scope.courseData);
    }
    pathVizService.loadCourseData($scope.onCourseDataLoaded);

    $scope.onAlumniDataLoaded = function (data) {
        angular.forEach(data, function (row, index) {
            // Skip header
            if (index === 0)
                return;
            $scope.alumniData.push({
                id: row[0],
                position: row[1],
                name: row[2],
                courses: [ row[3],row[4],row[5] ],
                selected: false
            });
        });
        angular.forEach($scope.alumniData, function (alumnus, index) {
            alumnus.coords = [];
            alumnus.coords.push('-100 '+((20)*index-90));
            angular.forEach(alumnus.courses, function (courseId, index) {
                var c = $scope.courseData[courseId].coord;
                alumnus.coords.push(c.x + ' ' + c.y);
            });
            alumnus.d = 'M ' + alumnus.coords.join(' L ');
        });

        console.log($scope.alumniData);
    }
    pathVizService.loadAlumniData($scope.onAlumniDataLoaded);

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


  });
