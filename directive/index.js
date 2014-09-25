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

  this.template('_directive.' + config.appScript,
    path.join(config.appDir, config.modulePath, config.hyphenName + '-directive.' + config.appScript), config);
  this.template('_directive.' + config.markup,
    path.join(config.appDir, config.modulePath, config.hyphenName + '-directive.tpl.' + config.markup), config);
  this.template('_spec.' + config.testScript,
    path.join(config.testDir, config.modulePath, config.hyphenName + '-directive_test.' + config.testScript), config);
};
