'use strict';
var genBase = require('../genBase')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName();
};

Generator.prototype.writing = function writing() {
  this.copySrc('constant');
  this.copyUnitTest('constant');
};
