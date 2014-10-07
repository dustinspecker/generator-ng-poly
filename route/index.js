'use strict';
var fs = require('fs')
  , path = require('path')
  , genBase = require('../genBase')
  , utils = require('../utils')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName({url: true, templateUrl: true});

  // convert backslashes to forwardslashes for Windows
  if (this.templateUrl) {
    this.templateUrl = this.templateUrl.replace('\\', '/');
  }

};

Generator.prototype.writing = function writing() {
  var config = this.getConfig()

    ,  newState = {
      module: this.module,
      url: this.url,
      lowerCamel: config.lowerCamel,
      hyphenName: config.hyphenName,
      ctrlName: config.ctrlName,
      templateUrl: this.templateUrl
    }

    // save modifications
    , newRouteConfig = {
      appScript: config.appScript,
      controllerAs: config.controllerAs,
      passFunc: config.passFunc,
      ngRoute: config.ngRoute
    }

    // module file to add route to
    , filePath, file;

  console.log(utils.hyphenName(this.templateUrl));

  filePath = path.join(this.config.path, '..', config.appDir, config.modulePath,
    utils.hyphenName(config.moduleName) + '.coffee');

  // load JavaScript app if CoffeeScript app doesn't exist
  if (fs.existsSync(filePath)) {
    file = fs.readFileSync(filePath, 'utf8');
  } else {
    filePath = path.join(this.config.path, '..', config.appDir, config.modulePath,
      utils.hyphenName(config.moduleName) + '.js');
    file = fs.readFileSync(filePath, 'utf8');
  }

  fs.writeFileSync(filePath, utils.addRoute(file, newState, newRouteConfig));

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
  }, {
    local: require.resolve('../controller'),
    link: 'strong'
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
      'ng-route': this.options['ng-route'],
      style: this.options.style
    }
  }, {
    local: require.resolve('../view'),
    link: 'strong'
  });
};
