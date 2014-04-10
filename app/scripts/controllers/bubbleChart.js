'use strict';

angular.module('a3App')
  .controller('BubbleChartCtrl', function ($scope, pathVizService) {
    $scope.svg = {
        width: 800,
        height: 600
    };
    $scope.courseData = pathVizService.courseData;
    $scope.alumniData = pathVizService.alumniData;
    $scope.highlightedAlumni = [];
    $scope.selectedCourses = [];

    $scope.highlightPath = function (alumnus) {
        $scope.highlightedAlumni.push(alumnus.id);
        alumnus.highlighted = true;
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            $scope.courseData[courseIndex].isHighlighted = true;
        });
    }

    $scope.unhighlightPath = function (alumnus) {
        if ($scope.highlightedAlumni.indexOf(alumnus) >= 0) {
            $scope.highlightedAlumni.splice(alumnus.id, 1);
        }
        alumnus.highlighted = false;
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            $scope.courseData[courseIndex].isHighlighted = false;
        });
    }

    $scope.selectCourse = function (course) {
        angular.forEach($scope.selectedCourses, function (selectedCourse, index) {
            selectedCourse.isSelected = false;
        });
        course.isSelected = true;
        $scope.selectedCourses.push(course);
    }

    $scope.moveAlumniCoords = function () {
        var top = jQuery('.list-container').scrollTop();
        angular.forEach($scope.alumniData, function (alumnus, index) {
            alumnus.coord.y = alumnus.coord.originalY - top;
            if ((alumnus.coord.y > 100) || (alumnus.coord.y < -100)) {
                alumnus.hidden = true;
            }
            else
                alumnus.hidden = false;
        });
    }

  });
