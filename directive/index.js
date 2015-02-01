'use strict';
var genBase = require('../genBase')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName();
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();
  config.templateUrl = config.modulePath.replace('\\', '/');

  this.copySrc('directive', config);
  this.copyMarkup('directive', config);
  this.copyUnitTest('directive', config);
};
