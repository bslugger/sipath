'use strict';

describe('Controller: PathBarCtrl', function () {

  // load the controller's module
  beforeEach(module('a3App'));

  var PathBarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PathBarCtrl = $controller('PathBarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
