'use strict';
var genBase = require('../genBase')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName();
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.fs.copyTpl(
    this.templatePath('_value.' + config.appScript),
    this.destinationPath(config.appDir + '/' + config.modulePath + '/' + config.hyphenName +
      '-value.' + config.appScript),
    config
  );
  this.fs.copyTpl(
    this.templatePath('_spec.' + config.testScript),
    this.destinationPath(config.testDir + '/' + config.modulePath + '/' + config.hyphenName +
      '-value_test.' + config.testScript),
    config
  );
};
