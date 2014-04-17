'use strict';

angular.module('a3App')
  .controller('BubbleChartCtrl', function ($scope, pathVizService) {
    $scope.svg = {
        width: 800,
        height: 600
    };
    $scope.courseData = pathVizService.courseData;
    $scope.alumniData = pathVizService.alumniData;

    $scope.selectCourse = function (course) {
        pathVizService.clearSelectedCourses();
        pathVizService.selectCourse(course);
    }

    $scope.shouldShowOverview = true;
    $scope.highlightedAlumni = [];
    $scope.selectedAlumni = [];
    $scope.selectedAlumniCoursesData = {};

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

    /* Toggle courses display */

    $scope.hideAllCourses = function () {
        angular.forEach($scope.courseData, function (course, index) {
            course.isHidden = true;
        });
    }

    $scope.showAllCourses = function () {
        angular.forEach($scope.courseData, function (course, index) {
            course.isHidden = false;
        });
    }

    $scope.showCoursesByIds = function (courses) {
        $scope.hideAllCourses();
        angular.forEach(courses, function (courseIndex, index) {
            $scope.courseData[courseIndex].isHidden = false;
        });
    }

    /* Course layout */

    function setCourseLayoutByDefault(courses) {
        angular.forEach(courses, function (course, index) {
            course.coord.x = course.id/3 * 100;
            course.coord.y = index % 3 * 100;
        });
    }

    function restoreCourseLayoutByOriginal(courses, original) {
        angular.forEach(courses, function (course, index) {
            course.coord.x = original[index].x;
            course.coord.y = original[index].y;
        });
    }

    function setCourseLayoutBySemester(courses) {
        angular.forEach(courses, function (course, index) {
            course.coord.x = index % 3 * 100;
            course.coord.y = Math.floor(index/3) * 100;
        });
    }

    /* View switching event handler */

    $scope.onAlumnusClicked = function (alumnus) {
        $scope.selectedAlumni.length = 0;
        $scope.selectedAlumni.push(alumnus);
        updateViewAsAlumnus();
    }

    $scope.onOverviewClicked = function () {
        var alumnus = $scope.selectedAlumni[0];
        // Move course to overview posistion
        restoreCourseLayoutByOriginal($scope.selectedAlumniCoursesData.courses,
                                      $scope.selectedAlumniCoursesData.originalCoords);
        $scope.selectedAlumni.length = 0;

        $scope.shouldShowOverview = true;
        $scope.showAllCourses();
    }

    /* Update for alumnus view */

    function updateAlumnusCoursePath(alumnus) {
        var courseCoords = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            courseCoords.push($scope.courseData[courseIndex].coord);
        });
        $scope.selectedAlumniCoursesData.d = svgCoords2path(courseCoords);
    }

    function updateViewAsAlumnus() {
        var alumnus = $scope.selectedAlumni[0];
        var courses = $scope.selectedAlumniCoursesData.courses = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            courses.push($scope.courseData[courseIndex]);
        });

        // Save original coords for restoration
        $scope.selectedAlumniCoursesData.originalCoords = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            var oldCoord = $scope.courseData[courseIndex].coord;
            $scope.selectedAlumniCoursesData.originalCoords.push({x: oldCoord.x, y: oldCoord.y});
        });

        // Move course coords by semesters
        setCourseLayoutBySemester(courses);

        updateAlumnusCoursePath(alumnus);

        $scope.shouldShowOverview = false;
        $scope.showCoursesByIds(alumnus.courses);
    }
  });
