'use strict';

describe('Service: csvReaderService', function () {

  // load the service's module
  beforeEach(module('a3App'));

  // instantiate service
  var csvReaderService;
  beforeEach(inject(function (_csvReaderService_) {
    csvReaderService = _csvReaderService_;
  }));

  it('should do something', function () {
    expect(!!csvReaderService).toBe(true);
  });

});
