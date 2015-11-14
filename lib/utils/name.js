'use strict';
import _ from 'underscore.string';

/**
 * Returns human readable form
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
function humanName(name) {
  return _.humanize(name);
}

/**
 * Returns hyphenated name
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
function hyphenName(name) {
  return _.slugify(humanName(name));
}

/**
 * Returns upper camel case
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
function upperCamel(name) {
  return _.classify(hyphenName(name));
}

module.exports = {
  humanName,
  hyphenName,
  upperCamel,

  /**
   * Returns controller name
   * @param {String} name - name to convert
   * @return {String} - converted name
   */
  ctrlName(name) {
    return `${upperCamel(name)}Ctrl`;
  },

  /**
   * Returns lower camel case
   * @param {String} name - name to convert
   * @return {String} - converted name
   */
  lowerCamel(name) {
    return _.camelize(hyphenName(name));
  }
};
