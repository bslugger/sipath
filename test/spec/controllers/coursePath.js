'use strict';

describe('Controller: CoursePathCtrl', function () {

  // load the controller's module
  beforeEach(module('a3App'));

  var CoursePathCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CoursePathCtrl = $controller('CoursePathCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
