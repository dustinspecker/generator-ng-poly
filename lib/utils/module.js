'use strict';
import _ from 'lodash';
import findUp from 'find-up';
import fs from 'fs';
import nameUtils from './name';
import path from 'path';

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

exports.getAppDir = function getAppDir() {
  let appDir = require(path.join(path.dirname(findUp.sync('.yo-rc.json')), 'build.config.js')).appDir;
  if (appDir[appDir.length - 1] === '/' || appDir[appDir.length - 1] === '\\') {
    appDir = appDir.slice(0, appDir.length - 1);
  }
  return appDir;
};

/**
 * Returns child and parent module names
 * @param {String} modulePath - path to module
 * @return {Array} - [child, parent]
 */
exports.extractModuleNames = function extractModuleNames(modulePath) {
  let appName;
  // return appName for app.js
  if (modulePath === exports.getAppDir()) {
    appName = require(path.join(path.dirname(findUp.sync('.yo-rc.json')), 'package.json')).name;
    return [appName, null];
  }

  modulePath = modulePath.replace(/\\/g, '/');
  // uses module syntax
  if (modulePath.indexOf('/') > -1) {
    return extractBasedOnChar(modulePath, '/');
  }

  return [modulePath, null];
};

/**
 * Converts backslashes and forwardslashes to path separator
 * @param {String} modulePath - path to module
 * @return {String} - normalized module path
 */
exports.normalizeModulePath = function normalizeModulePath(modulePath) {
  if (modulePath === exports.getAppDir()) {
    return '';
  }

  modulePath = modulePath.replace(/[\\\/]/g, path.sep);
  modulePath = modulePath.split(path.sep).map(nameUtils.hyphenName).join(path.sep);

  return modulePath;
};

/**
 * Returns if module exists in app
 * @param {String} modulePath - path to module
 * @return {Boolean} - does module exist?
 */
exports.moduleExists = function moduleExists(modulePath) {
  // check if file exists
  let yoPath = path.dirname(findUp.sync('yo-rc.json'))
    , fullPath;

  if (modulePath === exports.getAppDir()) {
    return true;
  }

  fullPath = path.join(yoPath, exports.getAppDir(), exports.normalizeModulePath(modulePath));

  return fs.existsSync(fullPath);
};

/**
 * Return file path
 * @param {String} filePath - path to module MINUS the convention {,-routes,-module} and extension
 * @param {Boolean} isLookingForRoutes - looking for routes file? or just module?
 * @return {String} file path
*/
function findFile(filePath, isLookingForRoutes) {
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
 * Returns routesfile path
 * @param {String} routesPath - path to module MINUS the convention {,-routes,-module} and extension
 * @return {String} - file path
 */
exports.findRoutesFile = function findRoutesFile(routesPath) {
  return findFile(routesPath, true);
};

/**
 * Returns module file path
 * @param {String} modulePath - path to module MINUS the convention {,-module} and extension
 * @return {String} - file path
 */
exports.findModuleFile = function findModuleFile(modulePath) {
  return findFile(modulePath, false);
};

/**
 * Returns list of files that are script files
 * @param {String[]} files - list of files to filter
 * @return {String[]} - script files
 */
function filterScriptFiles(files) {
  return files.filter(file => {
    return file.indexOf('.coffee') >= 0 || file.indexOf('.js') >= 0 || file.indexOf('.ts') >= 0 ||
      file.indexOf('.es6') >= 0;
  });
}

/**
 * Returns list of files that are modules
 * @param {String[]} files - list of files to filter
 * @return {String[]} - module files
 */
function filterModuleFiles(files) {
  return files.filter(file => {
    const fileBaseDirectoryWithSuffix = path.dirname(file).split(path.sep).pop() + '-module'
      , fileName = path.basename(file).replace(path.extname(file), '');

    return fileName === fileBaseDirectoryWithSuffix;
  });
}

/**
 * Returns directories of files
 * @param {String[]} files - list of files to filter
 * @return {String[]} - directories
 */
function filterDirectories(files) {
  return files.map(file => path.dirname(file));
}

/**
 * Converts module string to key value pairs {name, value} for choice
 * @param {String[]} modules - list of modules
 * @return {Object[]} - {name, value} of module
 */
function convertToChoice(modules) {
  return modules.map(module => {
    return {
      name: module,
      value: module.replace(exports.getAppDir() + '\\', '').replace(exports.getAppDir() + '/', '')
    };
  });
}

/**
 * Returns list of modules when given a list of files
 * @param {String[]} files - list of files to filter
 * @return {Object[]} - list of modules
 */
exports.moduleFilter = function moduleFilter(files) {
  let filteredFiles = filterScriptFiles(files);

  filteredFiles = filterModuleFiles(filteredFiles);

  filteredFiles = filterDirectories(filteredFiles);

  // remove duplicate directories
  filteredFiles = _.uniq(filteredFiles);

  return convertToChoice(filteredFiles);
};
