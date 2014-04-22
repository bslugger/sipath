'use strict';

angular.module('a3App')
  .service('pathVizService', function (CsvReaderService) {
    var self = this;

    self.courseData = [];
    self.alumniData = [];
    self.courseIdTable = {};

    self.loadCourseIdTable = function (callback) {
      CsvReaderService.readJson('/images/course_id_table.json', callback);
    }
    self.onloadCourseIdTableLoaded = function (data) {
        self.courseIdTable = data;
    }
    self.loadCourseIdTable(self.onloadCourseIdTableLoaded);

    self.getCourseById = function (course_id) {
        return self.courseData[self.courseIdTable[course_id]];
    }

    self.loadData = function (callback) {
      CsvReaderService.read('/images/anon689_2.csv', callback);  
    }
    self.loadData2 = function (callback) {
      CsvReaderService.read2Json('/images/anon689_2.csv', callback);  
    }
    self.loadCourseDummyData = function (callback) {
      CsvReaderService.read('/images/course.csv', callback);
    }
    self.loadAlumniDummyData = function (callback) {
      CsvReaderService.read('/images/alumni.csv', callback);
    }
    self.onCourseDummyDataLoaded = function (data) {
        angular.forEach(data, function (row, index) {
            // Skip header
            if (index === 0)
                return;
            self.courseData.push({
                id: row[0],
                number: row[1],
                name: row[2],
                coord: {x: index%3 * 130, y: row[0]/3 * 120},
                popularity: row[3],
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mauris ligula, porta sed erat sed, semper molestie lacus. Cras a justo purus. Nulla quis lectus lacinia leo varius tempor eget eu dui. Aenean in eleifend ipsum. Nunc faucibus.',
                isHidden: false,
                isSelected: false,
                isHighlighted: false
            });
        });
    }
    // self.loadCourseDummyData(self.onCourseDummyDataLoaded);

    self.onCourseDataLoaded = function (data) {
        angular.forEach(data, function (row, index) {
            self.courseData.push({
                id: row['course_id'],
                number: row['course_number'],
                name: row['course_title'],
                coord: {x: index%3 * 130, y: index/3 * 120},
                popularity: row['alumni_count']/1000,
                description: row['course_description'],
                terms: row['term_info'],
                isHidden: false,
                isSelected: false,
                isHighlighted: false
            });
        });
    }
    self.loadCourseData = function (callback) {
      CsvReaderService.readJson('/images/course.json', callback);
    }
    self.loadCourseData(self.onCourseDataLoaded);

    self.selectedBgName = {};
    self.selectedPosName = {};

    self.updateAlumniPath = function () {
        angular.forEach(self.alumniData, function (alumnus, index) {
            alumnus.pathCoords = [];
            // alumnus.pathCoords.push(alumnus.coord);
            angular.forEach(alumnus.courses, function (courseId, index) {
                var course = self.getCourseById(courseId);
                if (course !== undefined) {
                    var c = course.coord;
                    alumnus.pathCoords.push(c);
                    alumnus.pathCoords.push(alumnus.coord);
                }
            });
            alumnus.d = svgCoords2SimpleCubicBezierXPath(alumnus.pathCoords);
            // alumnus.d2 = svgCoords2SimpleCubicBezierXPath(alumnus.pathCoords.slice(1)).slice(2);
        });
    }

    self.onAlumniDummyDataLoaded = function (data) {
        angular.forEach(data, function (row, index) {
            // Skip header
            var courses = [ row[3], row[4], row[5], Math.floor(Math.random()*20), Math.floor(Math.random()*20), Math.floor(Math.random()*20) ];
            courses.sort(function(a, b) { return parseInt(a) > parseInt(b); });
            if (index === 0)
                return;
            self.alumniData.push({
                id: row[0],
                coord: {x: -100, y: ((20)*row[0]-90), originalY: ((20)*row[0]-90)},
                position: row[1],
                name: row[2],
                courses: courses,
                hidden: false,
                highlighted: false,
                searchResult: true
            });
        });
        self.updateAlumniPath();
    }
    // self.loadAlumniDummyData(self.onAlumniDummyDataLoaded);



    self.onAlumniDataLoaded = function (data) {
        angular.forEach(data, function (row, index) {
            // var courses = [ Math.floor(Math.random()*20), Math.floor(Math.random()*20), Math.floor(Math.random()*20) ];
            var courses = row['courses'];
            courses.sort(function(a, b) { return parseInt(a) > parseInt(b); });
            self.alumniData.push({
                id: row['alumni_id'],
                coord: {x: -100, y: ((20)*index-90), originalY: ((20)*index-90)},
                position: row['job_title'],
                name: row['organization'],
                courses: courses,
                hidden: false,
                highlighted: false,
                searchResult: true
            });
        });
        self.updateAlumniPath();
    }
    self.loadAlumniData = function (callback) {
      CsvReaderService.readJson('/images/alumni.json', callback);
    }
    self.loadAlumniData(self.onAlumniDataLoaded);



    // Selection state methods
    // TODO: Where is a better place for this?
    // This is not strictly data related, but it's good to keep the state between views.
    // Do we need another service as Interface to manage these?
    self.selectedCourses = [];
    self.selectedCourseTerms = [];
    self.clearSelectedCourses = function () {
      angular.forEach(self.selectedCourses, function (course, index) {
        course.isSelected = false;
      });
      self.selectedCourses.length = 0;
      self.selectedCourseTerms.length = 0;
    }
    self.selectCourse = function (course) {
      course.isSelected = true;
      self.selectedCourses.push(course);
      self.selectedCourseTerms.push(course.terms);
      notifyObservers('selectedCourseTerms');
      // console.log(self.selectedCourseTerms.value);
    }
    self.isCourseSelected = function () {
      return self.selectedCourses.length > 0;
    }

    self.highlightPath = function (alumnus) {
        // self.highlightedAlumni.push(alumnus.id);
        alumnus.highlighted = true;
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            self.getCourseById(courseIndex).isHighlighted = true;
        });
    }

    self.unhighlightPath = function (alumnus) {
        // if (self.highlightedAlumni.indexOf(alumnus) >= 0) {
        //     self.highlightedAlumni.splice(alumnus.id, 1);
        // }
        alumnus.highlighted = false;
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            self.getCourseById(courseIndex).isHighlighted = false;
        });
    }

    var observerCallbacks = {};
    self.registerObserverCallback = function (variable, callback) {
        if (observerCallbacks[variable] == undefined)
            observerCallbacks[variable] = [];
        observerCallbacks[variable].push(callback);
    }

    var notifyObservers = function(variable) {
    for (variable in observerCallbacks) {
        if (!observerCallbacks.hasOwnProperty(variable))
            continue;
        var callbacks = observerCallbacks[variable];
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](self[variable]);
        }
    };
  };
  });
