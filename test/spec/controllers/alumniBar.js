'use strict';

describe('Controller: AlumniBarCtrl', function () {

  // load the controller's module
  beforeEach(module('a3App'));

  var AlumniBarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AlumniBarCtrl = $controller('AlumniBarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
