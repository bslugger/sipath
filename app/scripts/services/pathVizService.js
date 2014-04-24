'use strict';

angular.module('a3App')
  .service('pathVizService', function (CsvReaderService) {
    var self = this;

    self.courseData = [];
    self.alumniAllData = [];
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
    function orderize(numberString) {
        // create an array with 10 'th'
        var postfix = Array.apply(null, new Array(10)).map(String.prototype.valueOf,'th');
        postfix.splice(0, 3, 'st', 'nd', 'rd');
        return numberString + postfix[(parseInt(numberString)-1)%10];
    }

    self.onCourseDataLoaded = function (data) {
        angular.forEach(data, function (row, index) {
            var rawTerms = row['term_info'];
            var terms = {};
            for (var key in rawTerms) {
                if (!rawTerms.hasOwnProperty(key))
                    continue;
                if (parseInt(key) > 5)
                    break;
                terms[orderize(key)] = rawTerms[key];
            }

            var shift = ((index%3)==1)?0.5:0;
            self.courseData.push({
                id: row['course_id'],
                number: row['course_number'],
                catelog: row['course_catelog'],
                name: row['course_title'],
                coord: {x: (index%3) * 120, y: (Math.floor(index/3)+shift) * 150},
                originalRadius: row['alumni_count']/700,
                radius: row['alumni_count']/700,
                description: row['course_description'],
                terms: terms,
                popularity: row['alumni_count'],
                isHidden: false,
                isSelected: false,
                isHighlighted: false,
                isHovered: false
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

    self.filterAlumni = function () {
        var options = {background: self.selectedBgName.value, position: self.selectedPosName.value};
        self.alumniData.length = 0;

        function isValid(variable) {
            if (variable !== undefined)
                if (variable.length > 0)
                    return true;
            return  false;
        }
        angular.forEach(self.alumniAllData, function (alumnus, index) {
            // filter by both
            if (isValid(options.background) && isValid(options.position)) {
                if ((options.background === alumnus.background) && (options.position === alumnus.position))
                    self.alumniData.push(alumnus);
                else
                    return;
            }
            // filter by backgound only
            else if (isValid(options.background) && !isValid(options.position)) {
                if (options.background === alumnus.background)
                    self.alumniData.push(alumnus);
                else
                    return;
            }
            // filter by position only
            else if (!isValid(options.background) && isValid(options.position)) {
                if (options.position === alumnus.position)
                    self.alumniData.push(alumnus);
                else
                    return;
            }
        });
    }

    self.onAlumniDataLoaded = function (data) {
        angular.forEach(data, function (row, index) {
            // var courses = [ Math.floor(Math.random()*20), Math.floor(Math.random()*20), Math.floor(Math.random()*20) ];
            var courses = row['courses'];
            // courses.sort(function(a, b) { return parseInt(a) > parseInt(b); });
            self.alumniAllData.push({
                id: row['alumni_id'],
                // coord: {x: -100, y: ((20)*index-90), originalY: ((20)*index-90)},
                coord: {x: 320, y: -80},
                position: row['job_category'],
                title: row['job_title'],
                name: row['organization'],
                background: row['background_category'],
                courses: courses,
                hidden: false,
                highlighted: false,
                isSelected: false,
                searchResult: true
            });
        });
        self.filterAlumni();
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


    // Alumni selection

    self.selectedAlumni = [];

    self.clearSelectedAlumni = function () {
      angular.forEach(self.selectedAlumni, function (alumnus, index) {
        alumnus.isSelected = false;
      });
      self.selectedAlumni.length = 0;
    }
    
    self.selectAlumnus = function (alumnus) {
        self.clearSelectedAlumni();
        alumnus.isSelected = true;
        self.selectedAlumni.push(alumnus);
    }

    self.highlightedAlumni = [];
    self.isAnyAlumnushighlighted = {};
    self.highlightPath = function (alumnus) {
        self.highlightedAlumni.push(alumnus);
        self.isAnyAlumnushighlighted.value = true;
        alumnus.highlighted = true;
        angular.forEach(alumnus.courses, function (courseIndex, index) {
            self.getCourseById(courseIndex).isHighlighted = true;
        });
    }

    self.unhighlightPath = function (alumnus) {
        var index = self.highlightedAlumni.indexOf(alumnus);
        if (index >= 0) {
            self.highlightedAlumni.splice(index, 1);
        }
        if (self.highlightedAlumni.length === 0)
            self.isAnyAlumnushighlighted.value = false;


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
