'use strict';
var genBase = require('../genBase')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig()
    , elementDir = 'app/components/' + config.hyphenName + '/';

  this.mkdir(elementDir);
  this.copy('element.' + config.style, elementDir + config.hyphenName + '.' + config.style);
  this.template('_element.' + config.markup, elementDir + config.hyphenName + '.' + config.markup, config);
  this.template('_element.js', elementDir + config.hyphenName + '.js', config);
};
