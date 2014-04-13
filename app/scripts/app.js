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
        controller: 'SankeyCtrl'
      })
      .when('/course', {
        templateUrl: 'views/course.html',
        controller: 'CourseInfoCtrl'
      })
      .when('/bar', {
        templateUrl: 'views/barChart.html',
        controller: 'BarChartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
