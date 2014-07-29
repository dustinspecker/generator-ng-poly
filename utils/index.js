'use strict';
var _ = require('underscore.string')
  , fs = require('fs')
  , path = require('path');


// name generators
function lowerCamel(name) {
  return _.camelize(_.slugify(_.humanize(name)));
}

function upperCamel(name) {
  return _.classify(_.slugify(_.humanize(name)));
}

function humanName(name) {
  return _.humanize(name);
}

function hyphenName(name) {
  return _.slugify(_.humanize(name));
}

function ctrlName(name) {
  return upperCamel(name) + 'Ctrl';
}

// getters
function getAppName(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'package.json')).name;
}

function extractBasedOnChar(string, symbol) {
  var modules = [];

  // string after last symbol is module name
  var moduleName = string.slice(string.lastIndexOf(symbol)).replace(symbol, '');
  modules.push(moduleName);

  // determine if user provided more than 1 symbol
  var parentModuleName = string.slice(0, string.lastIndexOf(symbol));
  if (parentModuleName.indexOf(symbol) > -1) {
    parentModuleName = string.slice(parentModuleName.lastIndexOf(symbol), string.lastIndexOf(symbol));
    parentModuleName = parentModuleName.replace(symbol, '');
  }

  modules.push(parentModuleName);

  return modules;
}

function extractModuleNames(string) {
  string = string.replace(/\\/g, '/');
  // uses module syntax
  if (string.indexOf('/') > -1) {
    return extractBasedOnChar(string, '/');
  } else {
    return [string, null];
  }
}

function normalizeModulePath(modulePath) {
  return modulePath.replace(/[.\\]/g, path.sep);
}

function moduleExists(yoRcAbsolutePath, modulePath) {
  // check if file exists
  var yoPath = path.dirname(yoRcAbsolutePath)
    , fullPath = path.join(yoPath, 'app', normalizeModulePath(modulePath));

  return fs.existsSync(fullPath);
}

module.exports = {
  lowerCamel: lowerCamel,
  upperCamel: upperCamel,
  humanName: humanName,
  hyphenName: hyphenName,
  ctrlName: ctrlName,
  getAppName: getAppName,
  moduleExists: moduleExists,
  extractModuleNames: extractModuleNames
};