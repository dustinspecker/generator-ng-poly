'use strict';
var genBase = require('../genBase')
  , path = require('path');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName();
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_provider.js', path.join('src', config.modulePath, config.hyphenName + '-provider.js'), config);
  this.template('_spec.' + config.testScript,
    path.join(config.testDir, config.modulePath, config.hyphenName + '-provider_test.' + config.testScript), config);
};