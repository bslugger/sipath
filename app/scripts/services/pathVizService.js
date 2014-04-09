'use strict';

angular.module('a3App')
  .service('pathVizService', function (CsvReaderService) {
    var self = this;
    self.rawData = {};
    self.loadDataWithUrl = function(url, callback) {
      CsvReaderService.read(
            url,
            function(d) {
              console.log(d);
              self.rawData = d;
              callback(d);
            }
      );
    }
    self.loadData = function (callback) {
      self.loadDataWithUrl('/images/anon689_2.csv', callback);  
    }
    self.loadCourseData = function (callback) {
      self.loadDataWithUrl('/images/course.csv', callback);
    }
    self.loadAlumniData = function (callback) {
      self.loadDataWithUrl('/images/alumni.csv', callback);
    }
    
  });
