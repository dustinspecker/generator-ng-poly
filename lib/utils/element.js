'use strict';

export default {
  /**
   * Validates element name by making sure a hyphen exists
   * @param {String} name - element name
   * @return {Boolean} is element name valid?
   */
  checkElementName(name) {
    return name.indexOf('-') > 0 && name.indexOf('-') < name.length - 1;
  }
};
