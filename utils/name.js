'use strict';
var _ = require('underscore.string')
  , exports = module.exports;

/**
 * Returns lower camel case
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.lowerCamel = function lowerCamel(name) {
  return _.camelize(_.slugify(_.humanize(name)));
};

/**
 * Returns upper camel case
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.upperCamel = function upperCamel(name) {
  return _.classify(_.slugify(_.humanize(name)));
};

/**
 * Returns human readable form
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.humanName = function humanName(name) {
  return _.humanize(name);
};

/**
 * Returns hyphenated name
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.hyphenName = function hyphenName(name) {
  return _.slugify(_.humanize(name));
};

/**
 * Returns controller name
 * @param {String} name - name to convert
 * @return {String} - converted name
 */
exports.ctrlName = function ctrlName(name) {
  return exports.upperCamel(name) + 'Ctrl';
};
