'use strict';
var util = require('util')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName();
  var providerName = utils.lowerCamel(this.name);

  var context = {
    appName: appName,
    providerName: providerName
  };

  this.template('_provider.js', 'src/js/providers/' + providerName + '.js', context);
  this.template('_spec.js', 'tests/unit/providers/' + providerName + '.spec.js', context);
};