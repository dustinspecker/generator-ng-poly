'use strict';
import findUp from 'find-up';
import path from 'path';
import removeTrailingSlash from 'remove-trailing-slash';

/**
 * Returns .yo-rc.json dirname
 * @returns {Promise<String>} - .yo-rc.json dirname
 */
function getYoPath() {
  return Promise.resolve(path.dirname(findUp.sync('.yo-rc.json')));
}

/**
 * Return JSON contents of file name from root
 * @param {String} fileName - name of file to read
 * @returns {Promise<Object>} - file contents
 */
function getFileFromRoot(fileName) {
  return getYoPath().then(yoPath => require(path.join(yoPath, fileName)));
}

/**
 * Return build config
 * @returns {Promise<Object>} - build config
 */
function getBuildConfig() {
  return getFileFromRoot('build.config.js');
}

export default {
  getFileFromRoot,
  getYoPath,

  /**
   * Gets the appDir from the root build.config.js without trailing / or \
   * @return {Promise<String>} - app directory path
   */
  getAppDir() {
    return getBuildConfig().then(config => removeTrailingSlash(config.appDir));
  },

  /**
   * Gets the app's name from the root package.json
   * @return {Promise<String>} - app name
   */
  getAppName() {
    return getFileFromRoot('package.json').then(pkg => pkg.name);
  },

  /**
   * Gets the unitTestDir from the root build.config.js
   * @return {Promise<String>} - unit test directory path
   */
  getUnitTestDir() {
    return getBuildConfig().then(config => config.unitTestDir);
  }
};
