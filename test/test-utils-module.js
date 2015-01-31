/*global describe, beforeEach, it */
'use strict';
var a = require('a')
  , assert = require('assert')
  , proxyquire = require('proxyquire')
  , utils = require('../utils/module');

describe('Module Utils', function () {
  describe('extractModuleNames', function () {
    it('should return app name when using app', function () {
      // mock out path to avoid needing to use file system to find package.json
      var pathStub = {
          join: function () {
            return 'package.json';
          }
        }
        // proxy utils
        , utilsProxy = proxyquire('../utils/module', {path: pathStub})

        // mock response
        , expectRequire = a.expectRequire;

      expectRequire('package.json').return({name: 'test'});

      // mock function to prevent looking for build.config.js
      utilsProxy.getAppDir = function getAppDir() {
        return 'app';
      };

      assert(JSON.stringify(utilsProxy.extractModuleNames('app')) === JSON.stringify(['test', null]));
    });

    it('should extract modules with slashes in path', function () {
      assert(JSON.stringify(utils.extractModuleNames('test/parent/child')) === JSON.stringify(['child', 'parent']));
    });

    it('should return module without slashes in path', function () {
      assert(JSON.stringify(utils.extractModuleNames('test')) === JSON.stringify(['test', null]));
    });
  });

  describe('moduleExists', function () {
    var pathStub, utilsProxy;

    beforeEach(function () {
      pathStub = {
        dirname: function () {
          return '.yo-rc.json';
        },
        join: function () {
          return 'app/home';
        }
      };
      utilsProxy = proxyquire('../utils/module', {path: pathStub});

      utilsProxy.getAppDir = function getAppDir() {
        return 'app';
      };
    });

    it('should return true when module is appDir', function () {
      assert(utilsProxy.moduleExists('app') === true);
    });

    // it('should call fs.exstsSync', function () {
    //   var fsStub = {
    //     existsSync: sinon.stub().returns(true)
    //   };
    //   utilsProxy = proxyquire('../utils/module', {fs: fsStub, path: pathStub});
    //   utilsProxy.normalizeModulePath = function normalizeModulePath() {
    //     return 'app/home';
    //   };
    //   utilsProxy.moduleExists('app/home');
    //   assert(fsStub.existsSync.callCount === 1);
    // });
  });

});
