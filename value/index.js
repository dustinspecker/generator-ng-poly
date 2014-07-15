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
  var valueName = utils.lowerCamel(this.name);

  var context = {
    appName: appName,
    valueName: valueName
  };

  this.template('_value.js', 'src/js/values/' + valueName + '.js', context);
  this.template('_spec.js', 'tests/unit/values/' + valueName + '.spec.js', context);
};