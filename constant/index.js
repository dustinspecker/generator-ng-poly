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
  var constantName = utils.lowerCamel(this.name);

  var context = {
    appName: appName,
    constantName: constantName
  };

  this.template('_constant.js', 'src/js/constants/' + constantName + '.js', context);
  this.template('_spec.js', 'tests/unit/constants/' + constantName + '.spec.js', context);
};