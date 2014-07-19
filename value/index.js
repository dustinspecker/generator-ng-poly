'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var valueName = utils.lowerCamel(this.name);
  var testScript = this.config.get('testScript');

  var context = {
    appName: appName,
    valueName: valueName
  };

  this.template('_value.js', 'src/js/values/' + valueName + '.js', context);
  this.template('_spec.' + testScript, 'tests/unit/values/' + valueName + '.spec.' + testScript, context);
};