'use strict';
import findUp from 'find-up';
import path from 'path';

/**
 * Returns .yo-rc.json dirname
 * @returns {String} - .yo-rc.json dirname
 */
function getYoPath() {
  return path.dirname(findUp.sync('.yo-rc.json'));
}

/**
 * Return JSON contents of file name from root
 * @param {String} fileName - name of file to read
 * @returns {Object} - file contents
 */
function getFileFromRoot(fileName) {
  return require(path.join(getYoPath(), fileName));
}

/**
 * Return build config
 * @returns {Object} - build config
 */
function getBuildConfig() {
  return getFileFromRoot('build.config.js');
}

export default {
  getFileFromRoot,
  getYoPath,

  /**
   * Gets the appDir from the root build.config.js without trailing / or \
   * @return {String} - app directory path
   */
  getAppDir() {
    return getBuildConfig().appDir.replace(/\/+$/, '');
  },

  /**
   * Gets the app's name from the root package.json
   * @return {String} - app name
   */
  getAppName() {
    return getFileFromRoot('package.json').name;
  },

  /**
   * Gets the unitTestDir from the root build.config.js
   * @return {String} - unit test directory path
   */
  getUnitTestDir() {
    return getBuildConfig().unitTestDir;
  }
};
