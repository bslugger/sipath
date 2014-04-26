'use strict';

angular.module('a3App')
  .service('courseAlumniViewService', function (pathVizService) {
    var self = this;
    self.courseData = pathVizService.courseData;
    self.alumniData = pathVizService.alumniData;

    self.selectedAlumni = [];
    self.selectedAlumniCoursesData = {};
    self.shouldDisplayBubbleView = { value: true };
    self.shouldShowAlumniBar = { value: false };
    self.getCourseById = pathVizService.getCourseById;
    self.svg = {
        width: 650,
        height: 4700,
        offset: 0
    };

    self.toggleAlumniBar = function () {
        self.shouldShowAlumniBar.value = !self.shouldShowAlumniBar.value;
        self.svg.offset = (self.shouldShowAlumniBar.value)? 220: 0;
        var column = (self.shouldShowAlumniBar.value)? 3: 5;
        setCourseLayoutByColumn(column, self.courseData);
        self.resizeSvgByCourse();
    }

    self.displayAlumniView = function (alumnus) {
        self.selectedAlumni.length = 0;
        self.selectedAlumni.push(alumnus);
        updateViewAsAlumnus();
        self.shouldDisplayBubbleView.value = false;
        self.showCoursesByIds(alumnus.courses);
        self.svg.width = 650;
        self.svg.height = 440;
        self.svg.offset = 0;
    }

    self.displayBubbleView = function (options) {
        var alumnus = self.selectedAlumni[0];
        // Move course to overview posistion
        if (options !== undefined) {
            if (options.restore === true)
                restoreCourseLayoutByOriginal(self.selectedAlumniCoursesData.courses,
                                      self.selectedAlumniCoursesData.originalCoords);
        }
        self.selectedAlumni.length = 0;

        self.shouldDisplayBubbleView.value = true;
        self.showCoursesWithPopularity();
        self.svg.width = 650;
        self.svg.height = 4700;
        self.svg.offset = (self.shouldShowAlumniBar.value)? 220: 0;
        self.resizeSvgByCourse();
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

    self.showCoursesWithPopularity = function () {
        angular.forEach(self.courseData, function (course, index) {
            if (course.popularity > 0)
                course.isHidden = false;
            else
                course.isHidden = true;
        });
    }    

    self.showCoursesByIds = function (courses) {
        self.hideAllCourses();
        angular.forEach(courses, function (courseIndex, index) {
            self.getCourseById(courseIndex).isHidden = false;
        });
    }

    self.updateCourseRadius = function () {
        angular.forEach(self.courseData, function (course, index) {
            course.popularity = 0;
        });
        angular.forEach(self.alumniData, function (alumnus, index) {
            angular.forEach(alumnus.courses, function (courseId, index) {
                var course = pathVizService.getCourseById(courseId);
                course.popularity += 1;
            });
        });
        var max = -99999;
        angular.forEach(self.courseData, function (course, index) {
            max = (course.popularity > max)? course.popularity: max;
        });
        angular.forEach(self.courseData, function (course, index) {
            course.radius = Math.log(course.popularity)/Math.log(max);
            course.originalRadius = Math.log(course.popularity)/Math.log(max);
            if (course.popularity === 0)
                course.isHidden = true;
            else
                course.isHidden = false;
        });


        var column = (self.shouldShowAlumniBar.value)? 3: 5;
        setCourseLayoutByColumn(column, self.courseData);
        self.resizeSvgByCourse();
    }

    self.resizeSvgByCourse = function () {
        var lastShowingCourse = {};
        var maxY = -999999;
        angular.forEach(self.courseData, function (course, index) {
            if (course.popularity > 0) {
                lastShowingCourse = course;
                maxY = (course.coord.y > maxY)? course.coord.y: maxY;
            }
        });
        self.svg.height = maxY + 150;
    }

    /* Course layout */

    function setCourseLayoutByColumn(column, courses) {
        var i = 0;
        angular.forEach(courses, function (course, index) {
            if (!course.isHidden) {
                course.coord = pathVizService.getGridLayoutCoordinate(column, i);
                i++;
            }
        });
    }

    function restoreCourseLayoutByOriginal(courses, original) {
        angular.forEach(courses, function (course, index) {
            course.coord.x = original[index].x;
            course.coord.y = original[index].y;
            course.isHighlighted = false;
            course.radius = course.originalRadius;
        });
    }

    function setCourseLayoutBySemester(courses) {
        angular.forEach(courses, function (course, index) {
            course.coord.x = index % 6 * 100;
            course.coord.y = Math.floor(index/6) * 100;
            course.radius = 0.5;
        });
    }

    /* Update for alumnus view */

    function updateAlumnusCoursePath(alumnus) {
        var courseCoords = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            courseCoords.push(self.getCourseById(courseIndex).coord);
        });
        self.selectedAlumniCoursesData.d = svgCoords2path(courseCoords);
    }

    function updateViewAsAlumnus() {
        var alumnus = self.selectedAlumni[0];
        var courses = self.selectedAlumniCoursesData.courses = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            courses.push(self.getCourseById(courseIndex));
        });

        // Save original coords for restoration
        self.selectedAlumniCoursesData.originalCoords = [];
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            var oldCoord = self.getCourseById(courseIndex).coord;
            self.selectedAlumniCoursesData.originalCoords.push({x: oldCoord.x, y: oldCoord.y});
            // self.getCourseById(courseIndex).isHighlighted = true;
        });

        // Move course coords by semesters
        setCourseLayoutBySemester(courses);

        updateAlumnusCoursePath(alumnus);
    }
  });
