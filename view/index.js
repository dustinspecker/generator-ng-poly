'use strict';
var genBase = require('../genBase')
  , path = require('path');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName();
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_view.' + config.markup,
    path.join('src', config.modulePath, config.hyphenName + '.tpl.' + config.markup), config);
  this.copy('style.less', path.join('src', config.modulePath, config.hyphenName + '.less'));
};