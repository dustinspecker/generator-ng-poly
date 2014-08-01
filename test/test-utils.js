/*global describe, it */
'use strict';
var assert = require('assert')
  , fs = require('fs')
  , path = require('path')
  , utils = require('../utils');

describe('Utils', function () {

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

  describe('humanize name', function () {
    it('should transform name with hyphens', function () {
      assert(utils.humanName('test-name') === 'Test name');
    });

    it('should transform upper camel name', function () {
      assert(utils.humanName('TestName') === 'Test name');
    });

    it('should transform underscore', function () {
      assert(utils.humanName('test_name') === 'Test name');
    });

    it('should transform mixed', function () {
      assert(utils.humanName('Test_name-fancy') === 'Test name fancy');
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

  describe('extractModuleNames', function () {
    it('should extract modules with slashes in path', function () {
      assert(JSON.stringify(utils.extractModuleNames('test/parent/child')) === JSON.stringify(['child','parent']));
    });

    it('should return module without slashes in path', function () {
      assert(JSON.stringify(utils.extractModuleNames('test')) === JSON.stringify(['test', null]));
    });
  });

  describe('addRoute', function () {
    it('should add new state without controllerAS', function () {
      var fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app.js'), 'utf8');
      var newState = {
        module:'home',
        url: 'test',
        lowerCamel: 'test',
        hyphenName: 'test',
        ctrlName: 'TestCtrl'
      };
      assert(utils.addRoute(fileContents, newState, false, false),
        /.state\(\'test\', {[^$]*url: \'\/test\'.[^$]*templateUrl: \'home\/test.tpl.html\',[^$]*controller: \'TestCtrl\'[^$]*}\)/);
    });

    it('should add new state with controllerAS', function () {
      var fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app.js'), 'utf8');
      var newState = {
        module:'home',
        url: 'test',
        lowerCamel: 'test',
        hyphenName: 'test',
        ctrlName: 'TestCtrl'
      };
      assert(utils.addRoute(fileContents, newState, true, true),
        /.state\(\'test\', {[^$]*url: \'\/test\'.[^$]*templateUrl: \'home\/test.tpl.html\',[^$]*controller: \'TestCtrl as test\'[^$]*}\)/);
    });
  });

  describe('checkElementName', function () {
    it('should throw error on name without a hyphen', function () {
      assert.throws(utils.checkElementName.bind(this, 'elementname'));
    });

    it('should throw error on name ending with a hyphen', function () {
      assert.throws(utils.checkElementName.bind(this,'elementname-'));
    });

    it('should not throw an error on name with hyphen in middle', function () {
      assert.doesNotThrow(utils.checkElementName.bind(this, 'element-name'));
    });
  });

});
