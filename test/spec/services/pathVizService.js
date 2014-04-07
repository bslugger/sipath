'use strict';

describe('Service: pathVizService', function () {

  // load the service's module
  beforeEach(module('a3App'));

  // instantiate service
  var pathVizService;
  beforeEach(inject(function (_pathVizService_) {
    pathVizService = _pathVizService_;
  }));

  it('should do something', function () {
    expect(!!pathVizService).toBe(true);
  });

});
