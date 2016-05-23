'use strict';
import 'babel-polyfill';
import fs from 'fs';
import genBase from '../genBase';
import ngAddDep from 'ng-add-dep';
import path from 'path';
import pify from 'pify';
import utils from '../utils';

module.exports = genBase.extend({
  async prompting() {
    await this.askForModuleName({url: true, templateUrl: true});

    // convert backslashes to forwardslashes for Windows
    if (this.templateUrl) {
      this.templateUrl = this.templateUrl.replace('\\', '/');
    }
  },

  async writing() {
    const config = await this.getConfig();

    const dependency = config.ngRoute ? 'ngRoute' : 'ui.router';

    const newRouteConfig = {
      appScript: config.appScript,
      controllerAs: config.controllerAs,
      skipController: config.skipController,
      passFunc: config.passFunc,
      ngRoute: config.ngRoute
    };

    // move this logic to utils-route
    config.url = this.url;
    config.lowerCamel = utils.lowerCamel(this.name.replace('.', '-'));
    config.hyphenName = utils.hyphenName(this.name.replace('.', '-'));
    config.ctrlName = utils.ctrlName(this.name.replace('.', '-'));
    config.humanName = utils.humanName(this.name.replace('.', '-'));

    const newState = {
      name: this.name,
      module: this.module,
      url: this.url,
      lowerCamel: config.lowerCamel,
      hyphenName: config.hyphenName,
      ctrlName: config.ctrlName,
      templateUrl: this.templateUrl
    };

    // create module path minus extension
    // if modulePath is empty file name is app
    const wipPath = path.join(this.config.path, '..', config.appDir, config.modulePath,
      config.modulePath === '' ? 'app' : utils.hyphenName(config.moduleName));

    // get name-module.{coffee,js,ts}
    const modulePath = await utils.findModuleFile(wipPath);

    // if file doesn't have the dependency, add it
    await pify(fs.writeFile)(modulePath, ngAddDep(await pify(fs.readFile)(modulePath, 'utf8'), dependency));

    // get name-routes.{coffee,js,ts}
    const routesPath = await utils.findRoutesFile(wipPath);
    // add route to route file
    await pify(fs.writeFile)(
      routesPath,
      utils.addRoute(await pify(fs.readFile)(routesPath, 'utf8'),
      newState,
      newRouteConfig
    ));

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
  }
});
