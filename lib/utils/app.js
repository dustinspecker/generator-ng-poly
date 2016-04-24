'use strict';
import getYoRcPath from 'get-yo-rc-path';
import path from 'path';
import removeTrailingSlash from 'remove-trailing-slash';

/**
 * Return JSON contents of file name from root
 * @param {String} fileName - name of file to read
 * @returns {Promise<Object>} - file contents
 */
/* eslint-disable space-before-function-paren */
const getFileFromRoot = async fileName =>
  /* eslint-enable space-before-function-paren */
  /* eslint-disable global-require */
  require(path.join(await getYoRcPath.dir(), fileName));
  /* eslint-enable global-require */

/**
 * Return build config
 * @returns {Promise<Object>} - build config
 */
const getBuildConfig = () =>
  getFileFromRoot('build.config.js');

module.exports = {
  getFileFromRoot,

  /**
   * Gets the appDir from the root build.config.js without trailing / or \
   * @return {Promise<String>} - app directory path
   */
  async getAppDir() {
    return removeTrailingSlash((await getBuildConfig()).appDir);
  },

  /**
   * Gets the unitTestDir from the root build.config.js
   * @return {Promise<String>} - unit test directory path
   */
  async getUnitTestDir() {
    return (await getBuildConfig()).unitTestDir;
  }
};
