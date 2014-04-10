'use strict';

describe('Controller: SankeyCtrl', function () {

  // load the controller's module
  beforeEach(module('a3App'));

  var SankeyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SankeyCtrl = $controller('SankeyCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
