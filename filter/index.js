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

  if (config.appScript === 'ts') {
    config.referencePath = path.relative(config.modulePath, config.appDir);
  }

  this.template('_filter.' + config.appScript,
    path.join(config.appDir, config.modulePath, config.hyphenName + '-filter.' + config.appScript), config);
  this.template('_spec.' + config.testScript,
    path.join(config.testDir, config.modulePath, config.hyphenName + '-filter_test.' + config.testScript), config);
};
