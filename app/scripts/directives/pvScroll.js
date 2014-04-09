'use strict';

angular.module('a3App')
  .directive('pvScroll', function ($parse) {
    return {
        restrict:'A',
        link: function(scope,element,attrs) {
            jQuery(element).scroll(function( e, rowid ) {
               scope[attrs.pvScroll]();
            });
        }
    }
  });
