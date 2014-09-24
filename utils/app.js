'use strict';
var exports = module.exports
  , path = require('path');

/**
 * Gets the app's name from the root package.json
 * @param {String} yoRcAbsolutePath
 * @return {String}
 */
exports.getAppName = function getAppName(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'package.json')).name;
};

/**
 * Gets the appDir from the root build.ocnfig.js
 * @param {String} yoRcAbsolutePath
 * @return {String}
 */
exports.getAppDir = function getAppName(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'build.config.js')).appDir;
};

/**
 * Gets the unitTestDir from the root build.ocnfig.js
 * @param {String} yoRcAbsolutePath
 * @return {String}
 */
exports.getUnitTestDir = function getUnitTestDir(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'build.config.js')).unitTestDir;
};
