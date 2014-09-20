/*global describe, it */
'use strict';
var assert = require('assert')
  , elementUtils = require('../utils/element');

describe('Element Utils', function () {
  describe('checkElementName', function () {
    it('should throw error on name without a hyphen', function () {
      assert.throws(elementUtils.checkElementName.bind(this, 'elementname'));
    });

    it('should throw error on name ending with a hyphen', function () {
      assert.throws(elementUtils.checkElementName.bind(this, 'elementname-'));
    });

    it('should not throw an error on name with hyphen in middle', function () {
      assert.doesNotThrow(elementUtils.checkElementName.bind(this, 'element-name'));
    });
  });
});
