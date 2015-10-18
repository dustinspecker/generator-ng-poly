'use strict';
import moduleUtils from './module';
import path from 'path';

/**
 * Return build config
 * @returns {Object} - build config
 */
function getBuildConfig() {
  return require(path.join(moduleUtils.getYoPath(), 'build.config.js'));
}

/**
 * Gets the appDir from the root build.config.js
 * @return {String} - app directory path
 */
exports.getAppDir = function () {
  return getBuildConfig().appDir;
};

/**
 * Gets the app's name from the root package.json
 * @return {String} - app name
 */
exports.getAppName = function () {
  return require(path.join(moduleUtils.getYoPath(), 'package.json')).name;
};

/**
 * Gets the unitTestDir from the root build.config.js
 * @return {String} - unit test directory path
 */
exports.getUnitTestDir = function () {
  return getBuildConfig().unitTestDir;
};
