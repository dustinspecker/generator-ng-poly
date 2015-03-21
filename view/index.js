'use strict';
var genBase = require('../genBase')
  , path = require('path')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName();
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig()
  , markupFile = this.name
  , styleFile;

  // if markupFile doesn't end with .tpl.html, append it
  if (!(/[.]tpl[.]html$/).test(this.name)) {
    markupFile += '.tpl.html';
  }

  // remove TplHtml from lowerCamel
  config.lowerCamel = config.lowerCamel.replace(/TplHtml$/, '');

  // remove TplHtml from ctrlName
  config.ctrlName = config.ctrlName.replace(/TplHtml$/, '');

  // create the style file
  styleFile = markupFile.replace(/tpl[.]html$/, config.style);

  // replace file extension with markup type being used
  markupFile = markupFile.replace(/html$/, config.markup);

  this.copyFile('markup', 'view', path.join(config.appDir, config.modulePath,
  (config.structure === 'module-type' ? 'views' : ''), markupFile), config);
  this.copyStyleFile('view', path.join(config.appDir, config.modulePath,
    (config.structure === 'module-type' ? 'views' : ''), styleFile), config);
};
