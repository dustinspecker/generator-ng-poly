'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var dirName = utils.lowerCamel(this.name);

  var context = {
    appName: appName,
    dirName: dirName
  };

  this.template('_directive.js', 'src/js/directives/' + dirName + '.js', context);
  this.template('_directive.jade', 'src/jade/templates/' + dirName + '.jade', context);
  this.template('_spec.js', 'tests/unit/directives/' + dirName + '.spec.js', context);
};