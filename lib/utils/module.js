'use strict';
import appUtils from './app';
import _ from 'lodash';
import fs from 'fs';
import nameUtils from './name';
import path from 'path';

/**
 * Converts module string to key value pair {name, value} for choice
 * @param {String} module - module name
 * @return {Promise<Object>} - {name, value} of module
 */
async function convertToChoice(module) {
  const appDir = await appUtils.getAppDir();

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

  return _.find(files, routesFile => fs.existsSync(routesFile));
}

/**
 * Determine if file is a module file
 * @param {String} file - file name to analyze
 * @return {Boolean} - is file a module file
 */
function filterModuleFiles(file) {
  const fileBaseDirectoryWithSuffix = path.dirname(file).split(path.sep).pop() + '-module'
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

export default {
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
  findModuleFile(modulePath) {
    return findFile(modulePath, false);
  },

  /**
   * Returns routesfile path
   * @param {String} routesPath - path to module MINUS the convention {,-routes,-module} and extension
   * @return {Promise<String>} - file path
   */
  findRoutesFile(routesPath) {
    return findFile(routesPath, true);
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
