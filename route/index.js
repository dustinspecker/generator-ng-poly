'use strict';
var fs = require('fs')
  , path = require('path')
  , genBase = require('../genBase')
  , utils = require('../utils');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName({ url: true, templateUrl: true });
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  // load app.js to prepare adding new state
  var filePath = path.join(this.config.path, '../app/', config.modulePath, config.moduleName + '.js')
    , file = fs.readFileSync(filePath, 'utf8');

  var newState = {
    module: this.module,
    url: this.url,
    lowerCamel: config.lowerCamel,
    hyphenName: config.hyphenName,
    ctrlName: config.ctrlName,
    templateUrl: this.templateUrl
  };

  // save modifications
  fs.writeFileSync(filePath, utils.addRoute(file, newState, config.controllerAs, config.passFunc));

  // e2e testing
  // create page object model
  this.template('page.po.' + config.testScript,
    path.join('e2e', config.hyphenName, config.hyphenName + '.po.' + config.testScript), config);
  // create test
  this.template('page_test.' + config.testScript,
    path.join('e2e', config.hyphenName, config.hyphenName + '_test.' + config.testScript), config);
};

Generator.prototype.end = function end() {
  this.composeWith('ng-poly:controller', {
    args: [this.name],
    options: {
      module: this.module,

      markup: this.options.markup,
      'app-script': this.options['app-script'],
      'controller-as': this.options['controller-as'],
      'pass-func': this.options['pass-func'],
      'named-func': this.options['named-func'],
      'test-script': this.options['test-script'],
      'test-dir': this.options['test-dir'],
      style: this.options.style
    }
  });
  this.composeWith('ng-poly:view', {
    args: [path.basename(this.templateUrl)],
    options: {
      module: this.module,

      markup: this.options.markup,
      'app-script': this.options['app-script'],
      'controller-as': this.options['controller-as'],
      'pass-func': this.options['pass-func'],
      'named-func': this.options['named-func'],
      'test-script': this.options['test-script'],
      'test-dir': this.options['test-dir'],
      style: this.options.style
    }
  });
};
