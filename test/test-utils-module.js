/*global describe, beforeEach, it */
'use strict';
var a = require('a')
  , assert = require('assert')
  , fs = require('fs')
  , path = require('path')
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

      assert(JSON.stringify(utilsProxy.extractModuleNames('app')) === JSON.stringify(['test', null]));
    });

    it('should extract modules with slashes in path', function () {
      assert(JSON.stringify(utils.extractModuleNames('test/parent/child')) === JSON.stringify(['child', 'parent']));
    });

    it('should return module without slashes in path', function () {
      assert(JSON.stringify(utils.extractModuleNames('test')) === JSON.stringify(['test', null]));
    });
  });

  describe('dependencyExists', function () {
    var fileContents;
    beforeEach(function () {
      fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
    });

    it('should find existing dependency', function () {
      assert(utils.dependencyExists(fileContents, 'ui.router') === true);
    });

    it('should not find non-existing dependency', function () {
      assert(utils.dependencyExists(fileContents, 'ngResource') === false);
    });
  });

});
