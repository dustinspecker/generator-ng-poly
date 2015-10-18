'use strict';
import _ from 'underscore.string';

export default {
  /**
   * Returns controller name
   * @param {String} name - name to convert
   * @return {String} - converted name
   */
  ctrlName(name) {
    return `${this.upperCamel(name)}Ctrl`;
  },

  /**
   * Returns human readable form
   * @param {String} name - name to convert
   * @return {String} - converted name
   */
  humanName(name) {
    return _.humanize(name);
  },

  /**
   * Returns hyphenated name
   * @param {String} name - name to convert
   * @return {String} - converted name
   */
  hyphenName(name) {
    return _.slugify(_.humanize(name));
  },

  /**
   * Returns lower camel case
   * @param {String} name - name to convert
   * @return {String} - converted name
   */
  lowerCamel(name) {
    return _.camelize(_.slugify(_.humanize(name)));
  },

  /**
   * Returns upper camel case
   * @param {String} name - name to convert
   * @return {String} - converted name
   */
  upperCamel(name) {
    return _.classify(_.slugify(_.humanize(name)));
  }
};
