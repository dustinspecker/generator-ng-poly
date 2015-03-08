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
    config.appScript = 'js';
  }

  this.copyStyleFile('element', path.join(elementDir, config.hyphenName + '.' + config.style), config);
  this.copyMarkupFile('element', path.join(elementDir, config.hyphenName + '.' + config.markup), config);
  this.copySrcFile('element', path.join(elementDir, config.hyphenName + '.' + config.appScript), config);
};
