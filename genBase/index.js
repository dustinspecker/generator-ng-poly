'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.getConfig = function getConfig() { 
  return {
    appName: utils.getAppName(this.config.path),
    ctrlName: utils.ctrlName(this.name),
    hyphenName: utils.hyphenName(this.name),
    lowerCamel: utils.lowerCamel(this.name),
    upperCamel: utils.upperCamel(this.name),
    markup: this.config.get('markup'),
    testScript: this.config.get('testScript')
  };
};

Generator.extend = require('class-extend').extend;