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
      return !(this.options && this.options.module)
    }.bind(this),
    validate: function (input) {
      return utils.moduleExists(this.config.path, input);
    }.bind(this)
  }, {
    name: 'url',
    message: 'What\'s the URL for this state?',
    default: function () {
      return '/' + utils.lowerCamel(this.name);
    }.bind(this),
    when: function() {
      return ( (params && params.url) && !(this.options && this.options.url) );
    }.bind(this)
  }, {
    name: 'templateUrl',
    message: 'What\'s the templateURL for this state?',
    default: function (answers) {
      var module = answers.module || this.options.module;
      return module + '/' + this.name + '.tpl.html';
    }.bind(this),
    when: function () {
      return ( (params && params.templateUrl) && !(this.options && this.options.templateUrl) );
    }.bind(this)
  }], function (props) {
    this.module = props.module || this.options.module;
    this.url = props.url || this.options.url;
    this.templateUrl = props.templateUrl || this.options.templateUrl;

    if (this.url && (this.url.charAt(0) !== '/' && this.url.charAt(0) !== '\\')) {
      this.url = '/' + this.url;
    }

    done();
  }.bind(this));
};

Generator.prototype.getConfig = function getConfig() {
  var config = this.config.getAll();
  config.appName = utils.getAppName(this.config.path);
  config.ctrlName = utils.ctrlName(this.name);
  config.humanName = utils.humanName(this.name);
  config.hyphenName = utils.hyphenName(this.name);
  config.lowerCamel = utils.lowerCamel(this.name);
  config.upperCamel = utils.upperCamel(this.name);

  if (this.module) {
    utils.moduleExists(this.config.path, this.module);
    var modules = utils.extractModuleNames(this.module);
    config.modulePath = this.module.replace('.', '/');
    config.moduleName = modules[0];
    config.parentModuleName = modules[1];
  }

  return config;
};

Generator.extend = require('class-extend').extend;