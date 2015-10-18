'use strict';

/**
 * Validates element name by making sure a hyphen exists
 * @param {String} name - element name
 * @return {Boolean} is element name valid?
 */
exports.checkElementName = function (name) {
  return name.indexOf('-') > 0 && name.indexOf('-') < name.length - 1;
};
