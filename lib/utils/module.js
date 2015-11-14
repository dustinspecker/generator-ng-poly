'use strict';
import _ from 'lodash';
import appUtils from './app';
import chalk from 'chalk';
import fs from 'fs';
import getYoRcPath from 'get-yo-rc-path';
import nameUtils from './name';
import ngModGetNames from 'ng-mod-get-names';
import path from 'path';
import pathExists from 'path-exists';
import pify from 'pify';

/**
 * Converts module string to key value pair {name, value} for choice
 * @param {String} module - module name
 * @return {Promise<Object>} - {name, value} of module
 */
async function convertToChoice(module) {
  let appDir = await appUtils.getAppDir();

  return {
    name: module,
    value: module.replace(appDir + '\\', '').replace(appDir + '/', '')
  };
}

/**
 * Returns modules' names in path
 * @param {String} modulePath - path to module
 * @param {String} symbol - character to split by
 * @return {Array} - module names
 */
function extractBasedOnChar(modulePath, symbol) {
  let modules = []
    // path after last symbol is module name
    , moduleName = modulePath.slice(modulePath.lastIndexOf(symbol)).replace(symbol, '')
    , parentModuleName;

  modules.push(moduleName);

  // determine if user provided more than 1 symbol
  parentModuleName = modulePath.slice(0, modulePath.lastIndexOf(symbol));
  if (parentModuleName.indexOf(symbol) > -1) {
    parentModuleName = modulePath.slice(parentModuleName.lastIndexOf(symbol), modulePath.lastIndexOf(symbol));
    parentModuleName = parentModuleName.replace(symbol, '');
  }

  modules.push(parentModuleName);

  return modules;
}

/**
 * Return file path
 * @param {String} filePath - path to module MINUS the convention {,-routes,-module} and extension
 * @param {Boolean} isLookingForRoutes - looking for routes file? or just module?
 * @return {Promise<String>} file path
*/
async function findFile(filePath, isLookingForRoutes) {
  let files = []
    , conventions = ['-module', '']
    , extensions = ['coffee', 'es6', 'js', 'ts'];

  if (isLookingForRoutes) {
    conventions.unshift('-routes');
  }

  conventions.forEach(convention => {
    extensions.forEach(extension => {
      files.push(filePath + convention + '.' + extension);
    });
  });

  return files[(await Promise.all(files.map(pathExists))).indexOf(true)];
}

/**
 * Determine if file is a module file
 * @param {String} file - file name to analyze
 * @return {Boolean} - is file a module file
 */
function filterModuleFiles(file) {
  let fileBaseDirectoryWithSuffix = path.dirname(file).split(path.sep).pop() + '-module'
    , fileName = path.basename(file).replace(path.extname(file), '');

  return fileName === fileBaseDirectoryWithSuffix;
}

/**
 * Determine if file is a script file
 * @param {String} file - file name to analyze
 * @return {Boolean} - is file a script file
 */
function filterScriptFiles(file) {
  return file.indexOf('.coffee') >= 0 || file.indexOf('.js') >= 0 || file.indexOf('.ts') >= 0 ||
    file.indexOf('.es6') >= 0;
}

module.exports = {
  /**
   * Returns child and parent module names
   * @param {String} modulePath - path to module
   * @return {Promise<Object[]>} - [child, parent]
   */
  async extractModuleNames(modulePath) {
    if (modulePath === await appUtils.getAppDir()) {
      return [
        (await appUtils.getFileFromRoot('package.json')).name,
        null
      ];
    }

    modulePath = modulePath.replace(/\\/g, '/');
    // uses module syntax
    if (modulePath.indexOf('/') > -1) {
      return extractBasedOnChar(modulePath, '/');
    }

    return [modulePath, null];
  },

  /**
   * Returns module file path
   * @param {String} modulePath - path to module MINUS the convention {,-module} and extension
   * @return {Promise<String>} - file path
   */
  async findModuleFile(modulePath) {
    let moduleFile = await findFile(modulePath, false);

    if (moduleFile.indexOf('-module') === -1) {
      console.log(chalk.red('Module file names without a `-module` prefix are deprecated. Official support will be ' +
        'dropped in v0.12.0. Add a `-module` prefix to be officially supported.'));
    }

    return moduleFile;
  },

  /**
   * Returns routesfile path
   * @param {String} routesPath - path to module MINUS the convention {,-routes,-module} and extension
   * @return {Promise<String>} - file path
   */
  async findRoutesFile(routesPath) {
    let routesFile = await findFile(routesPath, true);

    if (routesFile.indexOf('-routes') === -1) {
      console.log(chalk.red('Routes file names without a `-routes` prefix are deprecated. Official support will be ' +
        'dropped in v0.12.0. Add a `-routes` prefix to be officially supported.'));
    }

    return routesFile;
  },

  /**
   * Gets the app's name from the main module in the appDir
   * @return {Promise<String>} - app name
   */
  async getAppName() {
    let filePath, moduleFile;

    filePath = path.join(
      await getYoRcPath.dir(),
      await appUtils.getAppDir(),
      'app'
    );

    moduleFile = await this.findModuleFile(filePath);

    return ngModGetNames((await pify(fs.readFile)(moduleFile)).toString())[0];
  },

  /**
   * Returns list of modules when given a list of files
   * @param {String[]} files - list of files to filter
   * @return {Promise<Object[]>} - list of modules
   */
  moduleFilter(files) {
    return Promise.all(
      _.uniq(files.filter(filterScriptFiles)
        .filter(filterModuleFiles)
        .map(file => path.dirname(file)))
      .map(convertToChoice));
  },

  /**
   * Converts backslashes and forwardslashes to path separator
   * @param {String} modulePath - path to module
   * @return {Promise<String>} - normalized module path
   */
  async normalizeModulePath(modulePath) {
    if (modulePath === await appUtils.getAppDir()) {
      return '';
    }

    return modulePath
      .replace(/[\\\/]/g, path.sep)
      .split(path.sep)
      .map(nameUtils.hyphenName)
      .join(path.sep);
  }
};
