'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.askForModuleName = function askForModuleName(params) {
  var done = this.async();

  this.prompt([{
    name: 'module',
    message: 'Which module is this for?',
    default: this.name,
    when: function () {
      return !((this.options && this.options.options && this.options.options.module) || (this.options && this.options.module));
    }.bind(this),
    validate: function (input) {
      return utils.moduleExists(this.config.path, input);
    }.bind(this)
  }, {
    name: 'url',
    message: 'What\'s the url for this state?',
    default: this.name,
    when: function() {
      return ((params && params.url === true) && !(this.options && this.options.url));
    }.bind(this)
  }], function (props) {
    this.module = props.module || this.options.module || this.options.options.module;
    this.url = props.url || this.options.url;

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