'use strict';

describe('Service: courseAlumniViewService', function () {

  // load the service's module
  beforeEach(module('a3App'));

  // instantiate service
  var courseAlumniViewService;
  beforeEach(inject(function (_courseAlumniViewService_) {
    courseAlumniViewService = _courseAlumniViewService_;
  }));

  it('should do something', function () {
    expect(!!courseAlumniViewService).toBe(true);
  });

});
