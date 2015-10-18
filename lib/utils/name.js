'use strict';
import _ from 'underscore.string';

/**
 * Returns controller name
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.ctrlName = function (name) {
  return `${exports.upperCamel(name)}Ctrl`;
};

/**
 * Returns human readable form
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.humanName = function (name) {
  return _.humanize(name);
};

/**
 * Returns hyphenated name
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.hyphenName = function (name) {
  return _.slugify(_.humanize(name));
};

/**
 * Returns lower camel case
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.lowerCamel = function (name) {
  return _.camelize(_.slugify(_.humanize(name)));
};

/**
 * Returns upper camel case
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.upperCamel = function (name) {
  return _.classify(_.slugify(_.humanize(name)));
};
