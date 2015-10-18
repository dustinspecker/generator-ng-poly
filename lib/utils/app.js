'use strict';
import moduleUtils from './module';
import path from 'path';

/**
 * Return JSON contents of file name from root
 * @param {String} fileName - name of file to read
 * @returns {Object} - file contents
 */
function getFileFromRoot(fileName) {
  return require(path.join(moduleUtils.getYoPath(), fileName));
}

/**
 * Return build config
 * @returns {Object} - build config
 */
function getBuildConfig() {
  return getFileFromRoot('build.config.js');
}

export default {
  /**
   * Gets the appDir from the root build.config.js
   * @return {String} - app directory path
   */
  getAppDir() {
    return getBuildConfig().appDir;
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
