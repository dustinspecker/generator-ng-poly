'use strict';
var genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  var elementDir = 'app/components/' + config.hyphenName + '/';
  this.mkdir(elementDir);
  this.copy('element.less', elementDir + config.hyphenName + '.less');
  this.template('_element.' + config.markup, elementDir + config.hyphenName + '.' + config.markup, config);
  this.template('_element.js', elementDir + config.hyphenName + '.js', config);
};
