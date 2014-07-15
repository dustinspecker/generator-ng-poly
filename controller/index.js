'use strict';
var util = require('util')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  console.log('test2');
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.writing = function writing() {
  // get app name
  var appName = utils.getAppName();
  var ctrlName = utils.ctrlName(this.name);

  var context = {
    appName: appName,
    ctrlName: ctrlName
  };

  this.template('_controller.js', 'src/js/controllers/' + ctrlName + '.js', context);
  this.template('_spec.js', 'tests/unit/controllers/' + ctrlName + '.spec.js', context);
};