'use strict';
var _ = require('lodash')
  , fs = require('fs')
  , path = require('path')
  , genBase = require('../genBase')
  , ngAddDep = require('ng-add-dep')
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
    // save modifications
    , newRouteConfig = {
      appScript: config.appScript,
      controllerAs: config.controllerAs,
      skipController: config.skipController,
      passFunc: config.passFunc,
      ngRoute: config.ngRoute
    }

    , dependency = config.ngRoute ? 'ngRoute' : 'ui.router'

    // module file to add dep to
    , modulePath, moduleFile
    // route file to add route to
    , routesPath, routesFile
    , wipPath, newState;

  // move this logic to utils-route
  config.url = this.url;
  config.lowerCamel = utils.lowerCamel(this.name.replace('.', '-'));
  config.hyphenName = utils.hyphenName(this.name.replace('.', '-'));
  config.ctrlName = utils.ctrlName(this.name.replace('.', '-'));
  config.humanName = utils.humanName(this.name.replace('.', '-'));

  newState = {
    name: this.name,
    module: this.module,
    url: this.url,
    lowerCamel: config.lowerCamel,
    hyphenName: config.hyphenName,
    ctrlName: config.ctrlName,
    templateUrl: this.templateUrl
  };

  // create module path minus extension
  wipPath = path.join(this.config.path, '..', config.appDir, config.modulePath,
    utils.hyphenName(config.moduleName));

  // find name-module.{coffee,js,ts}
  modulePath = _.find([
    wipPath + '-module.es6',
    wipPath + '-module.coffee',
    wipPath + '-module.js',
    wipPath + '-module.ts',
    wipPath + '.es6',
    wipPath + '.coffee',
    wipPath + '.js',
    wipPath + '.ts'
    ], function (appFile) {
      return fs.existsSync(appFile);
    });
  moduleFile = fs.readFileSync(modulePath, 'utf8');
  // if file doesn't have the dependency, add it
  fs.writeFileSync(modulePath, ngAddDep(moduleFile, dependency));

  // find name-routes.{coffee,js,ts}
  routesPath = _.find([
    wipPath + '-routes.es6',
    wipPath + '-routes.coffee',
    wipPath + '-routes.js',
    wipPath + '-routes.ts',
    wipPath + '-module.es6',
    wipPath + '-module.coffee',
    wipPath + '-module.js',
    wipPath + '-module.ts',
    wipPath + '.es6',
    wipPath + '.coffee',
    wipPath + '.js',
    wipPath + '.ts'
    ], function (appFile) {
      return fs.existsSync(appFile);
    });
  routesFile = fs.readFileSync(routesPath, 'utf8');
  // add route to route file
  fs.writeFileSync(routesPath, utils.addRoute(routesFile, newState, newRouteConfig));

  this.copyE2e(config);

  if (!config.skipController) {
    // call controller subgenerator
    this.composeWith('ng-poly:controller', {
      args: [this.name.replace('.', '-')],
      options: {
        module: this.module,
        structure: this.options.structure,
        markup: this.options.markup,
        'app-script': this.options['app-script'],
        'controller-as': this.options['controller-as'],
        classes: this.options.classes,
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
  }

  // call view subgenerator
  this.composeWith('ng-poly:view', {
    args: [path.basename(this.templateUrl)],
    options: {
      module: this.module,
      structure: this.options.structure,
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
