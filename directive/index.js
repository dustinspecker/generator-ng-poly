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
  config.templateUrl = config.modulePath.replace('\\', '/');

  this.fs.copyTpl(
    this.templatePath('_directive.' + config.appScript),
    this.destinationPath(config.appDir + '/' + config.modulePath + '/' + config.hyphenName +
      '-directive.' + config.appScript),
    config
  );
  this.fs.copyTpl(
    this.templatePath('_directive.' + config.markup),
    this.destinationPath(config.appDir + '/' + config.modulePath + '/' + config.hyphenName +
      '-directive.tpl.' + config.markup),
    config
  );
  this.fs.copyTpl(
    this.templatePath('_spec.' + config.testScript),
    this.destinationPath(config.testDir + '/' + config.modulePath + '/' + config.hyphenName +
      '-directive_test.' + config.testScript),
    config
  );
};
