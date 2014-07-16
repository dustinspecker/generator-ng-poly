'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var valueName = utils.lowerCamel(this.name);

  var context = {
    appName: appName,
    valueName: valueName
  };

  this.template('_value.js', 'src/js/values/' + valueName + '.js', context);
  this.template('_spec.js', 'tests/unit/values/' + valueName + '.spec.js', context);
};