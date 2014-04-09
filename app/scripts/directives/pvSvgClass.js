'use strict';

angular.module('a3App')
  .directive('pvSvgClass', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var obj = JSON.parse(attrs.pvSvgClass);
        angular.forEach(obj, function(variableName, className) {
            scope.$watch(variableName, function(newVal, oldVal) {
                if (newVal) {
                    svgAddClass(element, className);
                }
                else {
                    svgRemoveClass(element, className);
                }
            });
        });
      }
    };
  });
