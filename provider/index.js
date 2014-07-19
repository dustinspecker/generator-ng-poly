'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var providerName = utils.lowerCamel(this.name);
  var testScript = this.config.get('testScript');

  var context = {
    appName: appName,
    providerName: providerName
  };

  this.template('_provider.js', 'src/js/providers/' + providerName + '.js', context);
  this.template('_spec.' + testScript, 'tests/unit/providers/' + providerName + '.spec.' + testScript, context);
};