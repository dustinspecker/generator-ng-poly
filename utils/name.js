'use strict';
var _ = require('underscore.string')
  , exports = module.exports
  , path = require('path');

/**
 * Returns lower camel case
 * @param {String} name
 * @return {String}
 */
exports.lowerCamel = function lowerCamel(name) {
  return _.camelize(_.slugify(_.humanize(name)));
};

/**
 * Returns upper camel case
 * @param {String} name
 * @return {String}
 */
exports.upperCamel = function upperCamel(name) {
  return _.classify(_.slugify(_.humanize(name)));
};

/**
 * Returns human readable form
 * @param {String} name
 * @return {String}
 */
exports.humanName = function humanName(name) {
  return _.humanize(name);
};

/**
 * Returns hyphenated name
 * @param {String} name
 * @return {String}
 */
exports.hyphenName = function hyphenName(name) {
  return _.slugify(_.humanize(name));
};

/**
 * Returns controller name
 * @param {String} name
 * @return {String}
 */
exports.ctrlName = function ctrlName(name) {
  return exports.upperCamel(name) + 'Ctrl';
};

/**
 * Gets the app's name from the root package.json
 * @param {String} yoRcAbsolutePath
 * @return {String}
 */
exports.getAppName = function getAppName(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'package.json')).name;
};
