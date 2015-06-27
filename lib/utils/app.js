'use strict';
import path from 'path';

/**
 * Gets the app's name from the root package.json
 * @param {String} yoRcAbsolutePath - path to .yo-rc.json file
 * @return {String} - app name
 */
exports.getAppName = function getAppName(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'package.json')).name;
};

/**
 * Gets the appDir from the root build.config.js
 * @param {String} yoRcAbsolutePath - path to .yo-rc.json file
 * @return {String} - app directory path
 */
exports.getAppDir = function getAppName(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'build.config.js')).appDir;
};

/**
 * Gets the unitTestDir from the root build.config.js
 * @param {String} yoRcAbsolutePath - path to .yo-rc.json file
 * @return {String} - unit test directory path
 */
exports.getUnitTestDir = function getUnitTestDir(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'build.config.js')).unitTestDir;
};
