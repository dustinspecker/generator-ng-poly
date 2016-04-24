'use strict';
import _ from 'underscore.string';

/**
 * Returns human readable form
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
const humanName = name =>
  _.humanize(name);

/**
 * Returns hyphenated name
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
const hyphenName = name =>
  _.slugify(humanName(name));

/**
 * Returns upper camel case
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
const upperCamel = name =>
  _.classify(hyphenName(name));

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
