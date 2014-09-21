'use strict';
var exports = module.exports;

/**
 * Validates element name
 * @param {String} name
 * @throws
 */
exports.checkElementName = function checkElementName(name) {
  if (name.indexOf('-') < 1 || name.indexOf('-') === name.length - 1) {
    throw 'Element name must have a hyphen (-) in it.';
  }
};
