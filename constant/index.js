'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var constantName = utils.lowerCamel(this.name);

  var context = {
    appName: appName,
    constantName: constantName
  };

  this.template('_constant.js', 'src/js/constants/' + constantName + '.js', context);
  this.template('_spec.js', 'tests/unit/constants/' + constantName + '.spec.js', context);
};