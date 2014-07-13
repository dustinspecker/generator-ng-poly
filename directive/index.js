'use strict';
var util = require('util')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.addDirective = function addDirective() {
  var appName = utils.getAppName();
  var dirName = utils.lowerCamel(this.name);

  var context = {
    appName: appName,
    dirName: dirName
  };

  this.template('_directive.js', 'src/js/directives/' + dirName + '.js', context);
  this.template('_directive.jade', 'src/jade/templates/' + dirName + '.jade', context);
  this.template('_spec.js', 'tests/unit/directives/' + dirName + '.spec.js', context);
};