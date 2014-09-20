/*global describe, it */
'use strict';
var assert = require('assert')
  , nameUtils = require('../utils/name');

describe('Name Utils', function () {
  describe('lower camel', function () {
    it('should transform name with hyphens', function () {
      assert(nameUtils.lowerCamel('test-name') === 'testName');
    });

    it('should transform upper camel name', function () {
      assert(nameUtils.lowerCamel('TestName') === 'testName');
    });

    it('should transform underscore', function () {
      assert(nameUtils.lowerCamel('test_name') === 'testName');
    });

    it('should transform mixed', function () {
      assert(nameUtils.lowerCamel('Test_name-fancy') === 'testNameFancy');
    });
  });

  describe('upper camel', function () {
    it('should transform name with hyphens', function () {
      assert(nameUtils.upperCamel('test-name') === 'TestName');
    });

    it('should transform upper camel name', function () {
      assert(nameUtils.upperCamel('TestName') === 'TestName');
    });

    it('should transform underscore', function () {
      assert(nameUtils.upperCamel('test_name') === 'TestName');
    });

    it('should transform mixed', function () {
      assert(nameUtils.upperCamel('Test_name-fancy') === 'TestNameFancy');
    });
  });

  describe('humanize name', function () {
    it('should transform name with hyphens', function () {
      assert(nameUtils.humanName('test-name') === 'Test name');
    });

    it('should transform upper camel name', function () {
      assert(nameUtils.humanName('TestName') === 'Test name');
    });

    it('should transform underscore', function () {
      assert(nameUtils.humanName('test_name') === 'Test name');
    });

    it('should transform mixed', function () {
      assert(nameUtils.humanName('Test_name-fancy') === 'Test name fancy');
    });
  });

  describe('hyphen name', function () {
    it('should transform name with hyphens', function () {
      assert(nameUtils.hyphenName('test-name') === 'test-name');
    });

    it('should transform upper camel name', function () {
      assert(nameUtils.hyphenName('TestName') === 'test-name');
    });

    it('should transform underscore', function () {
      assert(nameUtils.hyphenName('test_name') === 'test-name');
    });

    it('should transform mixed', function () {
      assert(nameUtils.hyphenName('Test_name-fancy') === 'test-name-fancy');
    });
  });

  describe('ctrl name', function () {
    it('should transform name with hyphens', function () {
      assert(nameUtils.ctrlName('test-name') === 'TestNameCtrl');
    });

    it('should transform upper camel name', function () {
      assert(nameUtils.ctrlName('TestName') === 'TestNameCtrl');
    });

    it('should transform underscore', function () {
      assert(nameUtils.ctrlName('test_name') === 'TestNameCtrl');
    });

    it('should transform mixed', function () {
      assert(nameUtils.ctrlName('Test_name-fancy') === 'TestNameFancyCtrl');
    });
  });
});
