'use strict';
var exports = module.exports
  , findup = require('findup-sync')
  , fs = require('fs')
  , nameUtils = require('./name')
  , path = require('path');

/**
 * Returns modules' names in path
 * @param {String} name
 * @param {String} symbol
 * @return {Array}
 */
function extractBasedOnChar(path, symbol) {
  var modules = []
    // path after last symbol is module name
    , moduleName = path.slice(path.lastIndexOf(symbol)).replace(symbol, '')
    , parentModuleName;

  modules.push(moduleName);

  // determine if user provided more than 1 symbol
  parentModuleName = path.slice(0, path.lastIndexOf(symbol));
  if (parentModuleName.indexOf(symbol) > -1) {
    parentModuleName = path.slice(parentModuleName.lastIndexOf(symbol), path.lastIndexOf(symbol));
    parentModuleName = parentModuleName.replace(symbol, '');
  }

  modules.push(parentModuleName);

  return modules;
}

exports.getAppDir = function getAppDir() {
  var appDir = require(path.join(path.dirname(findup('.yo-rc.json')), 'build.config.js')).appDir;
  if (appDir[appDir.length - 1] === '/' || appDir[appDir.length - 1] === '\\') {
    appDir = appDir.slice(0, appDir.length - 1);
  }
  return appDir;
};

/**
 * Returns child and parent module names
 * @param {String} name
 * @return {Array}
 */
exports.extractModuleNames = function extractModuleNames(name) {
  // return appName for app.js
  if (name === exports.getAppDir()) {
    var appName = require(path.join(path.dirname(findup('.yo-rc.json')), 'package.json')).name;
    return [appName, null];
  }

  name = name.replace(/\\/g, '/');
  // uses module syntax
  if (name.indexOf('/') > -1) {
    return extractBasedOnChar(name, '/');
  }

  return [name, null];
};

/**
 * Converts backslashes and forwardslashes to path separator
 * @param {String} modulePath
 * @return {String}
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
 * @param {String} modulePath
 * @return {Boolean}
 */
exports.moduleExists = function moduleExists(modulePath) {
  // check if file exists
  var yoPath = path.dirname(findup('yo-rc.json'))
    , fullPath;

  if (modulePath === exports.getAppDir()) {
    return true;
  }

  fullPath = path.join(yoPath, exports.getAppDir(), exports.normalizeModulePath(modulePath));

  return fs.existsSync(fullPath);
};
