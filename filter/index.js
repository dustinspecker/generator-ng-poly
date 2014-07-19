'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var filterName = utils.lowerCamel(this.name);
  var testScript = this.config.get('testScript');

  var context = {
    appName: appName,
    filterName: filterName
  };

  this.template('_filter.js', 'src/js/filters/' + filterName + '.js', context);
  this.template('_spec.' + testScript, 'tests/unit/filters/' + filterName + '.spec.' + testScript, context);
};