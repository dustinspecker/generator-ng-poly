/* global describe, it */
'use strict';
import elementUtils from '../generators/utils/element';
import {expect} from 'chai';

describe('Element Utils', () => {
  describe('checkElementName', () => {
    it('should return false for name without a hyphen', () => {
      expect(elementUtils.checkElementName('elementname')).to.eql(false);
    });

    it('should return false for name ending with a hyphen', () => {
      expect(elementUtils.checkElementName('elementname-')).to.eql(false);
    });

    it('should return true for name with hyphen in middle', () => {
      expect(elementUtils.checkElementName('element-name')).to.eql(true);
    });
  });
});
