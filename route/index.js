'use strict';
var _ = require('lodash')
  , fs = require('fs')
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
    // save modifications
    , newRouteConfig = {
      appScript: config.appScript,
      controllerAs: config.controllerAs,
      skipController: config.skipController,
      passFunc: config.passFunc,
      ngRoute: config.ngRoute
    }

    // module file to add route to
    , modulePathTemplate, modulePath, file, newState;

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
  modulePathTemplate = path.join(this.config.path, '..', config.appDir, config.modulePath,
    utils.hyphenName(config.moduleName));
  // find module.{coffee, js, ts}
  modulePath = _.find([
    modulePathTemplate + '.coffee',
    modulePathTemplate + '.js',
    modulePathTemplate + '.ts'
    ], function (appFile) {
      return fs.existsSync(appFile);
    });
  file = fs.readFileSync(modulePath, 'utf8');

  fs.writeFileSync(modulePath, utils.addRoute(file, newState, newRouteConfig));

  this.copyE2e(config);

  if (!config.skipController) {
    // call controller subgenerator
    this.composeWith('ng-poly:controller', {
      args: [this.name.replace('.', '-')],
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
  }

  // call view subgenerator
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
