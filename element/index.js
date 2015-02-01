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

  this.fs.copy(
    this.templatePath('element.' + config.style),
    this.destinationPath(elementDir + '/' + config.hyphenName + '.' + config.style)
  );
  this.copyMarkup('element', path.join(elementDir, config.hyphenName + '.' + config.markup), config);
  this.fs.copyTpl(
    this.templatePath('_element.' + (config.appScript === 'ts' ? 'js' : config.appScript)),
    this.destinationPath(elementDir + '/' + config.hyphenName + '.' +
      (config.appScript === 'ts' ? 'js' : config.appScript)),
    config
  );
};
