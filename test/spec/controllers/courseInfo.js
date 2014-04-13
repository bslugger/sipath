'use strict';

describe('Controller: CourseInfoCtrl', function () {

  // load the controller's module
  beforeEach(module('a3App'));

  var CourseInfoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CourseInfoCtrl = $controller('CourseInfoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
