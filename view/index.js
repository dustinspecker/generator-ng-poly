'use strict';
var genBase = require('../genBase')
  , path = require('path')
  , utils = require('../utils');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName();
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  utils.moduleExists(this.config.path, this.module);

  var modules = utils.extractModuleNames(this.module);
  config.moduleName = modules[0];
  config.parentModuleName = modules[1];
  config.modulePath = this.module.replace('.', '/');

  this.template('_view.' + config.markup,
    path.join('src', config.modulePath, config.hyphenName + '.tpl.' + config.markup), config);
  this.copy('style.less', path.join('src', config.modulePath, config.hyphenName + '.less'));
};