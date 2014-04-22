'use strict';

angular.module('a3App')
  .service('courseAlumniViewService', function (pathVizService) {
    var self = this;
    self.courseData = pathVizService.courseData;

    self.selectedAlumni = [];
    self.selectedAlumniCoursesData = {};
    self.shouldDisplayBubbleView = { value: true };

    self.displayAlumniView = function (alumnus) {
        self.selectedAlumni.length = 0;
        self.selectedAlumni.push(alumnus);
        updateViewAsAlumnus();
        self.shouldDisplayBubbleView.value = false;
        self.showCoursesByIds(alumnus.courses);
        console.log(self.shouldDisplayBubbleView);
    }

    self.displayBubbleView = function () {
        var alumnus = self.selectedAlumni[0];
        // Move course to overview posistion
        restoreCourseLayoutByOriginal(self.selectedAlumniCoursesData.courses,
                                      self.selectedAlumniCoursesData.originalCoords);
        self.selectedAlumni.length = 0;

        self.shouldDisplayBubbleView.value = true;
        self.showAllCourses();
        console.log(self.shouldDisplayBubbleView);
    }

    /* Toggle courses display */

    self.hideAllCourses = function () {
        angular.forEach(self.courseData, function (course, index) {
            course.isHidden = true;
        });
    }

    self.showAllCourses = function () {
        angular.forEach(self.courseData, function (course, index) {
            course.isHidden = false;
        });
    }

    self.showCoursesByIds = function (courses) {
        self.hideAllCourses();
        angular.forEach(courses, function (courseIndex, index) {
            self.courseData[courseIndex].isHidden = false;
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

    /* Update for alumnus view */

    function updateAlumnusCoursePath(alumnus) {
        var courseCoords = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            courseCoords.push(self.courseData[courseIndex].coord);
        });
        self.selectedAlumniCoursesData.d = svgCoords2path(courseCoords);
    }

    function updateViewAsAlumnus() {
        var alumnus = self.selectedAlumni[0];
        var courses = self.selectedAlumniCoursesData.courses = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            courses.push(self.courseData[courseIndex]);
        });

        // Save original coords for restoration
        self.selectedAlumniCoursesData.originalCoords = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            var oldCoord = self.courseData[courseIndex].coord;
            self.selectedAlumniCoursesData.originalCoords.push({x: oldCoord.x, y: oldCoord.y});
        });

        // Move course coords by semesters
        setCourseLayoutBySemester(courses);

        updateAlumnusCoursePath(alumnus);
    }
  });
