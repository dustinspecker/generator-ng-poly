'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.askForModuleName = function askForModuleName() {
  var done = this.async();

  this.prompt([{
    name: 'module',
    message: 'Which module is this for?',
    default: this.name,
    when: function () {
      return !(this.options && this.options.options && this.options.options.module);
    }.bind(this),
    validate: function (input) {
      return utils.moduleExists(this.config.path, input);
    }.bind(this)
  }], function (props) {
    this.module = props.module || this.options.options.module;

    done();
  }.bind(this));
};

Generator.prototype.getConfig = function getConfig() { 
  return {
    appName: utils.getAppName(this.config.path),
    ctrlName: utils.ctrlName(this.name),
    hyphenName: utils.hyphenName(this.name),
    lowerCamel: utils.lowerCamel(this.name),
    upperCamel: utils.upperCamel(this.name),
    modulePath: this.module,
    markup: this.config.get('markup'),
    testScript: this.config.get('testScript')
  };
};

Generator.extend = require('class-extend').extend;