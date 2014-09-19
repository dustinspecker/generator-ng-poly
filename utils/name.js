'use strict';
var _ = require('underscore.string')
  , exports = module.exports
  , path = require('path');

// name generators
exports.lowerCamel = function lowerCamel(name) {
  return _.camelize(_.slugify(_.humanize(name)));
};

exports.upperCamel = function upperCamel(name) {
  return _.classify(_.slugify(_.humanize(name)));
};

exports.humanName = function humanName(name) {
  return _.humanize(name);
};

exports.hyphenName = function hyphenName(name) {
  return _.slugify(_.humanize(name));
};

exports.ctrlName = function ctrlName(name) {
  return exports.upperCamel(name) + 'Ctrl';
};

exports.getAppName = function getAppName(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'package.json')).name;
};
