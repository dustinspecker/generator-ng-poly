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
  var factoryName = utils.lowerCamel(this.name);

  var context = {
    appName: appName,
    factoryName: factoryName
  };

  this.template('_factory.js', 'src/js/factories/' + factoryName + '.js', context);
  this.template('_spec.js', 'tests/unit/factories/' + factoryName + '.spec.js', context);
};