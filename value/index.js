'use strict';
var genBase = require('../genBase')
  , path = require('path')
  , utils = require('../utils');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.prompt([{
    name: 'module',
    message: 'Which module is this for?',
    default: this.name,
    when: function () {
      return !(this.options && this.options.options && this.options.options.module);
    }.bind(this)
  }], function (props) {
    this.module = props.module || this.options.options.module;

    done();
  }.bind(this));
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  utils.moduleExists(this.config.path, this.module);

  var modules = utils.extractModuleNames(this.module);
  config.moduleName = modules[0];
  config.parentModuleName = modules[1];
  config.modulePath = this.module.replace('.', '/');

  this.template('_value.js', path.join('src', config.modulePath, config.hyphenName + '-value.js'), config);
  this.template('_spec.' + config.testScript,
    path.join('src', config.modulePath, config.hyphenName + '-value_test.' + config.testScript), config);
};