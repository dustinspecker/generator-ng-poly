'use strict';
var endOfLine = require('os').EOL
  , exports = module.exports
  , findup = require('findup-sync')
  , fs = require('fs')
  , nameUtils = require('./name')
  , path = require('path');

function extractBasedOnChar(string, symbol) {
  var modules = []
    // string after last symbol is module name
    , moduleName = string.slice(string.lastIndexOf(symbol)).replace(symbol, '')
    , parentModuleName;

  modules.push(moduleName);

  // determine if user provided more than 1 symbol
  parentModuleName = string.slice(0, string.lastIndexOf(symbol));
  if (parentModuleName.indexOf(symbol) > -1) {
    parentModuleName = string.slice(parentModuleName.lastIndexOf(symbol), string.lastIndexOf(symbol));
    parentModuleName = parentModuleName.replace(symbol, '');
  }

  modules.push(parentModuleName);

  return modules;
}

exports.extractModuleNames = function extractModuleNames(string) {
  // return appName for app.js
  if (string === 'app') {
    var appName = require(path.join(path.dirname(findup('.yo-rc.json')), 'package.json')).name;
    return [appName, null];
  }

  string = string.replace(/\\/g, '/');
  // uses module syntax
  if (string.indexOf('/') > -1) {
    return extractBasedOnChar(string, '/');
  }

  return [string, null];
};

exports.normalizeModulePath = function normalizeModulePath(modulePath) {
  if (modulePath === 'app') {
    return '';
  }

  modulePath = modulePath.replace(/[\\\/]/g, path.sep);
  modulePath = modulePath.split(path.sep).map(nameUtils.hyphenName).join(path.sep);

  return modulePath;
};

exports.moduleExists = function moduleExists(yoRcAbsolutePath, modulePath) {
  // check if file exists
  var yoPath = path.dirname(yoRcAbsolutePath)
    , fullPath;

  if (modulePath === 'app') {
    return true;
  }

  fullPath = path.join(yoPath, 'app', exports.normalizeModulePath(modulePath));

  return fs.existsSync(fullPath);
};

exports.dependencyExists = function dependencyExists(fileContents, dependency) {
  var regex = new RegExp('[.]module[^$]*\'[^$]*\', \\[[^$]*\'' + dependency + '\'[^$]*\\]');
  return regex.test(fileContents);
};

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
