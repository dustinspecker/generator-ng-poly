'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator')
  , Generator;

Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.askForModuleName = function askForModuleName(params) {
  var done = this.async();

  this.prompt([{
    name: 'module',
    message: 'Which module is this for?',
    default: this.config.get('lastUsedModule'),
    when: function () {
      return !(this.options && this.options.module);
    }.bind(this),
    validate: function (input) {
      return utils.moduleExists(this.config.path, input);
    }.bind(this)
  }, {
    name: 'url',
    message: 'What\'s the URL for this route?',
    default: function () {
      return '/' + utils.lowerCamel(this.name);
    }.bind(this),
    when: function () {
      return ((params && params.url) && !this.config.get('ngRoute') && !(this.options && this.options.url));
    }.bind(this)
  }, {
    name: 'templateUrl',
    message: 'What\'s the templateURL for this route?',
    default: function (answers) {
      var module = answers.module || this.options.module;
      return utils.normalizeModulePath(module) + '/' + utils.hyphenName(this.name) + '.tpl.html';
    }.bind(this),
    when: function () {
      return ((params && params.templateUrl) && !(this.options && this.options['template-url']));
    }.bind(this)
  }], function (props) {
    this.module = props.module || this.options.module;
    this.url = props.url || this.options.url || this.name;
    this.templateUrl = props.templateUrl || this.options['template-url'];

    // if moduleName ends with a slash remove it
    if (this.module.charAt(this.module.length - 1) === '/' || this.module.charAt(this.module.length - 1) === '\\') {
      this.module = this.module.slice(0, this.module.length - 1);
    }

    // save this module to suggest later
    this.config.set('lastUsedModule', this.module);
    this.config.forceSave();

    // prepend slash if missing
    if (this.url && (this.url.charAt(0) !== '/' && this.url.charAt(0) !== '\\')) {
      this.url = '/' + this.url;
    }

    // convert backslashes to forwardslashes for Windows
    if (this.templateUrl) {
      this.templateUrl = this.templateUrl.replace('\\', '/');
    }

    // append .tpl.html if not existing
    if (!/[.]tpl[.]html$/.test(this.templateUrl)) {
      this.templateUrl = this.templateUrl + '.tpl.html';
    }

    done();
  }.bind(this));
};

Generator.prototype.getConfig = function getConfig() {
  var config = {
    markup: this.options.markup || this.config.get('markup'),
    appScript: this.options['app-script'] || this.config.get('appScript'),
    controllerAs: (this.options['controller-as'] !== undefined && this.options['controller-as'] !== null) ?
      this.options['controller-as'] : this.config.get('controllerAs'),
    passFunc: (this.options['pass-func'] !== undefined && this.options['pass-func'] !== null) ?
      this.options['pass-func'] : this.config.get('passFunc'),
    namedFunc: (this.options['named-func'] !== undefined && this.options['named-func'] !== null) ?
      this.options['named-func'] : this.config.get('namedFunc'),
    testScript: this.options['test-script'] || this.config.get('testScript'),
    testFramework: this.config.get('testFramework'),
    style: this.options.style || this.config.get('style'),
    ngRoute: (this.options['ng-route'] !== undefined && this.options['ng-route'] !== null) ?
      this.options['ng-route'] : this.config.get('ngRoute'),

    appName: utils.getAppName(this.config.path),
    appDir: utils.getAppDir(this.config.path),
    testDir: utils.getUnitTestDir(this.config.path),
    ctrlName: utils.ctrlName(this.name),
    humanName: utils.humanName(this.name),
    hyphenName: utils.hyphenName(this.name),
    lowerCamel: utils.lowerCamel(this.name),
    upperCamel: utils.upperCamel(this.name)
  }
  , modules;

  if (this.module) {
    modules = utils.extractModuleNames(this.module);
    config.modulePath = utils.normalizeModulePath(this.module);
    config.moduleName = modules[0];
    config.parentModuleName = modules[1];
  }

  return config;
};

Generator.extend = require('class-extend').extend;
