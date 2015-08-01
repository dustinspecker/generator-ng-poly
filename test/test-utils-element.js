/* global describe, it */
'use strict';
import assert from 'assert';
import elementUtils from '../generators/utils/element';

describe('Element Utils', () => {
  describe('checkElementName', () => {
    it('should return false for name without a hyphen', () => {
      assert(elementUtils.checkElementName('elementname') === false);
    });

    it('should return false for name ending with a hyphen', () => {
      assert(elementUtils.checkElementName('elementname-') === false);
    });

    it('should return true for name with hyphen in middle', () => {
      assert(elementUtils.checkElementName('element-name') === true);
    });
  });
});
