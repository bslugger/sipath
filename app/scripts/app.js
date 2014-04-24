'use strict';

angular.module('a3App', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/data', {
        templateUrl: 'views/data.html',
        controller: 'DataCtrl'
      })
      .when('/bubble', {
        templateUrl: 'views/bubble.html',
        controller: 'BubbleChartCtrl'
      })
      .when('/sankey', {
        templateUrl: 'views/sankey.html',
        controller: 'SankeyCtrl',
        resolve: {
          'PathVizServiceData': function(pathVizService) {
          }
        }
      })
      .when('/course', {
        templateUrl: 'views/coursePath.html',
        controller: 'CoursePathCtrl'
      })
      .when('/bar', {
        templateUrl: 'views/barChart.html',
        controller: 'BarChartCtrl'
      })
      .when('/pathbar', {
        templateUrl: 'views/pathBar.html',
        controller: 'PathBarCtrl'
      })
      .when('/alumnibar', {
        templateUrl: 'views/alumniBar.html',
        controller: 'AlumniBarCtrl'
      })
      .when('/scrollbar', {
        templateUrl: 'views/scrollbartest.html',
        controller: 'ScrollbarCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
