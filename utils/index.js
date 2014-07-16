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

function hyphenName(name) {
  return _.slugify(_.humanize(name));
};

function ctrlName(name) {
  return upperCamel(name) + 'Ctrl';
}

// getters
function getAppName(yoRcAbsolutePath) {
  // moves up a directory to get path of .yo-rc.json,
  // which is same dir as package.json
  return require(path.join(yoRcAbsolutePath, '../package.json')).name;
}

module.exports = {
  lowerCamel: lowerCamel,
  upperCamel: upperCamel,
  hyphenName: hyphenName,
  ctrlName: ctrlName,
  getAppName: getAppName
};