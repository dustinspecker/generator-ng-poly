'use strict';
var genBase = require('../genBase')
  , path = require('path')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig()
    , elementDir = path.join(config.appDir, 'components', config.hyphenName);

  this.mkdir(elementDir);

  if (config.appScript === 'ts') {
    config.referencePath = path.relative(elementDir, config.appDir);
  }

  this.copy('element.' + config.style, path.join(elementDir, config.hyphenName + '.' + config.style));
  this.template('_element.' + config.markup, path.join(elementDir, config.hyphenName + '.' + config.markup), config);
  this.template('_element.' + (config.appScript === 'ts' ? 'js' : config.appScript),
    path.join(elementDir, config.hyphenName + '.' + (config.appScript === 'ts' ? 'js' : config.appScript)), config);
};
