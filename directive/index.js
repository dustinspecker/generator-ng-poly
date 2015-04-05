'use strict';
var genBase = require('../genBase')
  , path = require('path')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName();
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();
  config.templateUrl = config.modulePath;
  if (config.structure === 'module-type') {
    config.templateUrl = path.join(config.modulePath, 'directives');
  }
  config.templateUrl = config.templateUrl.replace(/\\/g, '/');

  this.copyMarkupFile('directive', config);
  this.copySrcFile('directive', config);
  this.copyUnitTest('directive', config);
};
