'use strict';
var endOfLine = require('os').EOL
  , exports = module.exports
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
 * @param {String} yoRcAbsolutePath
 * @param {String} modulePath
 * @return {Boolean}
 */
exports.moduleExists = function moduleExists(yoRcAbsolutePath, modulePath) {
  // check if file exists
  var yoPath = path.dirname(yoRcAbsolutePath)
    , fullPath;

  if (modulePath === exports.getAppDir()) {
    return true;
  }

  fullPath = path.join(yoPath, exports.getAppDir(), exports.normalizeModulePath(modulePath));

  return fs.existsSync(fullPath);
};

/**
 * Returns if dependency is listed in app's dependencies
 * @param {String} fileContents
 * @param {String} dependency
 * @return {Boolean}
 */
exports.dependencyExists = function dependencyExists(fileContents, dependency) {
  var regex = new RegExp('[.]module[^$]*\'[^$]*\', \\[[^$]*\'' + dependency + '\'[^$]*\\]');
  return regex.test(fileContents);
};

/**
 * Adds dependency to fileContents
 * @param {String} fileContents
 * @param {String} dependency
 * @return {String}
 */
exports.addDependency = function addDependency(fileContents, dependency) {
  // find line to add new dependency
  var lines = fileContents.split(endOfLine)
    , angularDefinitionOpenLine = -1
    , angularDefinitionCloseLine = -1
    , i, numOfSpaces;

  lines.forEach(function (line, i) {
    // find line with angular.module('*', [
    if (angularDefinitionOpenLine < 0 && line.indexOf('.module') > -1) {
      angularDefinitionOpenLine = i;
    }

    // find line with closing ]);
    if (angularDefinitionOpenLine > -1 && angularDefinitionCloseLine < 0 && line.indexOf(']') > -1) {
      angularDefinitionCloseLine = i;
    }
  });

  // if there is a previous dependency
  // remove new line and add a comma to the previous depdendency
  // slice at the last quote to remove the varying line endings
  if (angularDefinitionCloseLine > angularDefinitionOpenLine + 1) {
    lines[angularDefinitionCloseLine - 1] =
      lines[angularDefinitionCloseLine - 1].slice(0, lines[angularDefinitionCloseLine - 1].lastIndexOf('\''));
    lines[angularDefinitionCloseLine - 1] = lines[angularDefinitionCloseLine - 1] + '\',';
  }

  numOfSpaces = lines[angularDefinitionCloseLine].substring(0, lines[angularDefinitionCloseLine].search(/[^ ]/)).length;

  dependency = '\'' + dependency + '\'';

  for (i = 0; i < numOfSpaces + 2; i++) {
    dependency = ' ' + dependency;
  }

  // insert new line and dependency
  lines.splice(angularDefinitionCloseLine, 0, dependency);

  return lines.join(endOfLine);
};
