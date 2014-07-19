'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var dirName = utils.lowerCamel(this.name);
  var markup = this.config.get('markup');
  var testScript = this.config.get('testScript');

  var context = {
    appName: appName,
    dirName: dirName
  };

  this.template('_directive.js', 'src/js/directives/' + dirName + '.js', context);
  this.template('_directive.' + markup, 'src/markup/templates/' + dirName + '.' + markup, context);
  this.template('_spec.' + testScript, 'tests/unit/directives/' + dirName + '.spec.' + testScript, context);
};