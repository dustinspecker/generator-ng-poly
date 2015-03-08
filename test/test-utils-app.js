/*global describe, it */
'use strict';
var a = require('a')
  , assert = require('assert')
  , proxyquire = require('proxyquire');

describe('App Utils', function () {
  describe('getAppDir', function () {
    it('should return app dir', function () {
      // mock out path to avoid needing to use file system to find package.json
      var pathStub = {
          join: function () {
            return 'build.config.js';
          }
        }
        // proxy utils
        , utilsProxy = proxyquire('../utils/app', {path: pathStub})

        // mock response
        , expectRequire = a.expectRequire;

      expectRequire('build.config.js').return({appDir: 'app'});

      assert(utilsProxy.getAppDir('test') === 'app');
    });
  });
});
