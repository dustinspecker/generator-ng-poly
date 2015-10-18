/* global describe, it */
'use strict';
import {expect} from 'chai';
import nameUtils from '../generators/utils/name';

describe('Name Utils', () => {
  describe('ctrl name', () => {
    it('should transform name with hyphens', () => {
      expect(nameUtils.ctrlName('test-name')).to.eql('TestNameCtrl');
    });

    it('should transform upper camel name', () => {
      expect(nameUtils.ctrlName('TestName')).to.eql('TestNameCtrl');
    });

    it('should transform underscore', () => {
      expect(nameUtils.ctrlName('test_name')).to.eql('TestNameCtrl');
    });

    it('should transform mixed', () => {
      expect(nameUtils.ctrlName('Test_name-fancy')).to.eql('TestNameFancyCtrl');
    });
  });

  describe('humanize name', () => {
    it('should transform name with hyphens', () => {
      expect(nameUtils.humanName('test-name')).to.eql('Test name');
    });

    it('should transform upper camel name', () => {
      expect(nameUtils.humanName('TestName')).to.eql('Test name');
    });

    it('should transform underscore', () => {
      expect(nameUtils.humanName('test_name')).to.eql('Test name');
    });

    it('should transform mixed', () => {
      expect(nameUtils.humanName('Test_name-fancy')).to.eql('Test name fancy');
    });
  });

  describe('hyphen name', () => {
    it('should transform name with hyphens', () => {
      expect(nameUtils.hyphenName('test-name')).to.eql('test-name');
    });

    it('should transform upper camel name', () => {
      expect(nameUtils.hyphenName('TestName')).to.eql('test-name');
    });

    it('should transform underscore', () => {
      expect(nameUtils.hyphenName('test_name')).to.eql('test-name');
    });

    it('should transform mixed', () => {
      expect(nameUtils.hyphenName('Test_name-fancy')).to.eql('test-name-fancy');
    });
  });

  describe('lower camel', () => {
    it('should transform name with hyphens', () => {
      expect(nameUtils.lowerCamel('test-name')).to.eql('testName');
    });

    it('should transform upper camel name', () => {
      expect(nameUtils.lowerCamel('TestName')).to.eql('testName');
    });

    it('should transform underscore', () => {
      expect(nameUtils.lowerCamel('test_name')).to.eql('testName');
    });

    it('should transform mixed', () => {
      expect(nameUtils.lowerCamel('Test_name-fancy')).to.eql('testNameFancy');
    });
  });

  describe('upper camel', () => {
    it('should transform name with hyphens', () => {
      expect(nameUtils.upperCamel('test-name')).to.eql('TestName');
    });

    it('should transform upper camel name', () => {
      expect(nameUtils.upperCamel('TestName')).to.eql('TestName');
    });

    it('should transform underscore', () => {
      expect(nameUtils.upperCamel('test_name')).to.eql('TestName');
    });

    it('should transform mixed', () => {
      expect(nameUtils.upperCamel('Test_name-fancy')).to.eql('TestNameFancy');
    });
  });
});
