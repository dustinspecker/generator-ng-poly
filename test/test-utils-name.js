/* global describe, it */
'use strict';
import assert from 'assert';
import nameUtils from '../generators/utils/name';

describe('Name Utils', () => {
  describe('lower camel', () => {
    it('should transform name with hyphens', () => {
      assert(nameUtils.lowerCamel('test-name') === 'testName');
    });

    it('should transform upper camel name', () => {
      assert(nameUtils.lowerCamel('TestName') === 'testName');
    });

    it('should transform underscore', () => {
      assert(nameUtils.lowerCamel('test_name') === 'testName');
    });

    it('should transform mixed', () => {
      assert(nameUtils.lowerCamel('Test_name-fancy') === 'testNameFancy');
    });
  });

  describe('upper camel', () => {
    it('should transform name with hyphens', () => {
      assert(nameUtils.upperCamel('test-name') === 'TestName');
    });

    it('should transform upper camel name', () => {
      assert(nameUtils.upperCamel('TestName') === 'TestName');
    });

    it('should transform underscore', () => {
      assert(nameUtils.upperCamel('test_name') === 'TestName');
    });

    it('should transform mixed', () => {
      assert(nameUtils.upperCamel('Test_name-fancy') === 'TestNameFancy');
    });
  });

  describe('humanize name', () => {
    it('should transform name with hyphens', () => {
      assert(nameUtils.humanName('test-name') === 'Test name');
    });

    it('should transform upper camel name', () => {
      assert(nameUtils.humanName('TestName') === 'Test name');
    });

    it('should transform underscore', () => {
      assert(nameUtils.humanName('test_name') === 'Test name');
    });

    it('should transform mixed', () => {
      assert(nameUtils.humanName('Test_name-fancy') === 'Test name fancy');
    });
  });

  describe('hyphen name', () => {
    it('should transform name with hyphens', () => {
      assert(nameUtils.hyphenName('test-name') === 'test-name');
    });

    it('should transform upper camel name', () => {
      assert(nameUtils.hyphenName('TestName') === 'test-name');
    });

    it('should transform underscore', () => {
      assert(nameUtils.hyphenName('test_name') === 'test-name');
    });

    it('should transform mixed', () => {
      assert(nameUtils.hyphenName('Test_name-fancy') === 'test-name-fancy');
    });
  });

  describe('ctrl name', () => {
    it('should transform name with hyphens', () => {
      assert(nameUtils.ctrlName('test-name') === 'TestNameCtrl');
    });

    it('should transform upper camel name', () => {
      assert(nameUtils.ctrlName('TestName') === 'TestNameCtrl');
    });

    it('should transform underscore', () => {
      assert(nameUtils.ctrlName('test_name') === 'TestNameCtrl');
    });

    it('should transform mixed', () => {
      assert(nameUtils.ctrlName('Test_name-fancy') === 'TestNameFancyCtrl');
    });
  });
});
