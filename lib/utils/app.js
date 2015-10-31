'use strict';
import fs from 'fs';
import getYoRcPath from 'get-yo-rc-path';
import moduleUtils from './module';
import ngModGetNames from 'ng-mod-get-names';
import path from 'path';
import pify from 'pify';
import removeTrailingSlash from 'remove-trailing-slash';

/**
 * Return JSON contents of file name from root
 * @param {String} fileName - name of file to read
 * @returns {Promise<Object>} - file contents
 */
async function getFileFromRoot(fileName) {
  return require(path.join(await getYoRcPath.dir(), fileName));
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

  /**
   * Gets the appDir from the root build.config.js without trailing / or \
   * @return {Promise<String>} - app directory path
   */
  async getAppDir() {
    return removeTrailingSlash((await getBuildConfig()).appDir);
  },

  /**
   * Gets the app's name from the main module in the appDir
   * @return {Promise<String>} - app name
   */
  async getAppName() {
    let filePath, moduleFile;

    filePath = path.join(
      await getYoRcPath.dir(),
      await this.getAppDir(),
      'app'
    );

    moduleFile = await moduleUtils.findModuleFile(filePath);

    return ngModGetNames((await pify(fs.readFile)(moduleFile)).toString())[0];
  },

  /**
   * Gets the unitTestDir from the root build.config.js
   * @return {Promise<String>} - unit test directory path
   */
  async getUnitTestDir() {
    return (await getBuildConfig()).unitTestDir;
  }
};
