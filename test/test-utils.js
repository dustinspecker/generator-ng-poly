/*global describe, beforeEach, it */
'use strict';
var assert = require('assert')
  , expectRequire = require('a').expectRequire
  , fs = require('fs')
  , helpers = require('yeoman-generator').test
  , path = require('path')
  , utils = require('../utils');

describe('ng-poly generator', function () {

  describe('lower camel', function () {
    it('should transform name with hyphens', function () {
      assert(utils.lowerCamel('test-name') === 'testName');
    });

    it('should transform upper camel name', function () {
      assert(utils.lowerCamel('TestName') === 'testName');
    });

    it('should transform underscore', function () {
      assert(utils.lowerCamel('test_name') === 'testName');
    });

    it('should transform mixed', function () {
      assert(utils.lowerCamel('Test_name-fancy') === 'testNameFancy');
    });
  });

  describe('upper camel', function () {
    it('should transform name with hyphens', function () {
      assert(utils.upperCamel('test-name') === 'TestName');
    });

    it('should transform upper camel name', function () {
      assert(utils.upperCamel('TestName') === 'TestName');
    });

    it('should transform underscore', function () {
      assert(utils.upperCamel('test_name') === 'TestName');
    });

    it('should transform mixed', function () {
      assert(utils.upperCamel('Test_name-fancy') === 'TestNameFancy');
    });
  });

  describe('hyphen name', function () {
    it('should transform name with hyphens', function () {
      assert(utils.hyphenName('test-name') === 'test-name');
    });

    it('should transform upper camel name', function () {
      assert(utils.hyphenName('TestName') === 'test-name');
    });

    it('should transform underscore', function () {
      assert(utils.hyphenName('test_name') === 'test-name');
    });

    it('should transform mixed', function () {
      assert(utils.hyphenName('Test_name-fancy') === 'test-name-fancy');
    });
  });

  describe('ctrl name', function () {
    it('should transform name with hyphens', function () {
      assert(utils.ctrlName('test-name') === 'TestNameCtrl');
    });

    it('should transform upper camel name', function () {
      assert(utils.ctrlName('TestName') === 'TestNameCtrl');
    });

    it('should transform underscore', function () {
      assert(utils.ctrlName('test_name') === 'TestNameCtrl');
    });

    it('should transform mixed', function () {
      assert(utils.ctrlName('Test_name-fancy') === 'TestNameFancyCtrl');
    });
  });

  describe('get app name', function () {
    // makes appNameReq dir because getAppName() moves up a directory
    it('retrieves app name from package.json', function () {
      fs.mkdirSync(process.cwd() + '/appNameReq/');
      expectRequire(path.join(process.cwd(), 'package.json')).return({name: 'appName'});
      assert(utils.getAppName(process.cwd() + '/appNameReq/') === 'appName');
    });
  });

});
