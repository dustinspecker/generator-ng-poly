'use strict';
var fs = require('fs')
  , join = require('path').join
  , genBase = require('../genBase')
  , utils = require('../utils');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName({url: true});
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  // load app.js to prepare adding new state
  var filePath = join(this.config.path, '../app/', config.modulePath, config.moduleName + '.js')
    , file = fs.readFileSync(filePath, 'utf8');

  var newState = {
    module: this.module,
    url: this.url,
    lowerCamel: config.lowerCamel,
    hyphenName: config.hyphenName,
    ctrlName: config.ctrlName
  };

  // save modifications
  fs.writeFileSync(filePath, utils.addRoute(file, newState, config.controllerAs, config.passFunc));

  // e2e testing
  // create page object model
  this.template('page.po.' + config.testScript,
    join('e2e', config.hyphenName, config.hyphenName + '.po.' + config.testScript), config);
  // create test
  this.template('page_test.' + config.testScript,
    join('e2e', config.hyphenName, config.hyphenName + '_test.' + config.testScript), config);
};

Generator.prototype.end = function end() {
  this.invoke('ng-poly:controller', {
    args: [this.name],
    options: {
      options: {
        module: this.module
      }
    }
  });
  this.invoke('ng-poly:view', {
    args: [this.name],
    options: {
      options: {
        module: this.module
      }
    }
  });
};
