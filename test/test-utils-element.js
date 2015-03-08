/*global describe, it */
'use strict';
var assert = require('assert')
  , elementUtils = require('../utils/element');

describe('Element Utils', function () {
  describe('checkElementName', function () {
    it('should return false for name without a hyphen', function () {
      assert(elementUtils.checkElementName('elementname') === false);
    });

    it('should return false for name ending with a hyphen', function () {
      assert(elementUtils.checkElementName('elementname-') === false);
    });

    it('should return true for name with hyphen in middle', function () {
      assert(elementUtils.checkElementName('element-name') === true);
    });
  });
});
