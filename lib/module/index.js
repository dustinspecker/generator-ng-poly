'use strict';
import fs from 'fs';
import GenBase from '../genBase';
import mkdirp from 'mkdirp';
import ngAddDep from 'ng-add-dep';
import path from 'path';
import utils from '../utils';

export default class Generator extends GenBase {
  constructor(...args) {
    super(...args);
  }

  get initialize() {
    return function () {
      this.module = this.name;

      // used by genBase to know this is not a normal component for module-type structures
      // used for creating TypeScript reference path
      this.isModule = true;

      // if moduleName ends with a slash remove it
      if (this.module.charAt(this.module.length - 1) === '/' || this.module.charAt(this.module.length - 1) === '\\') {
        this.module = this.module.slice(0, this.module.length - 1);
      }
    };
  }

  get writing() {
    return function () {
      let filePath, filePathToCheck, depName, parentDir, parentModuleName, moduleDest;

      this.context = this.getConfig();

      // extrac the new module name (last part of path)
      this.context.moduleName = path.basename(this.module);

      // modify context because these were all performed on the ENTIRE module path
      // instead of just the new module's name
      this.context.lowerCamel = utils.lowerCamel(this.context.moduleName);
      this.context.hyphenModule = utils.hyphenName(this.context.moduleName);
      this.context.upperModule = utils.upperCamel(this.context.moduleName);
      this.context.templateUrl = path.join(this.module).replace(/\\/g, '/');
      this.context.modulePath = utils.normalizeModulePath(this.module);

      // create new module directory
      mkdirp.sync(path.join(this.context.appDir, this.context.modulePath));

      // check if path and moduleName are the same
      // if yes - get root app.js file to prepare adding dep
      // else - get parent module file to prepare adding dep
      if (this.context.moduleName === this.module) {
        filePathToCheck = path.join(this.context.appDir, 'app');
      } else {
        // go up one driectory from new module's path to retrieve parent's directory
        parentDir = path.join(this.context.appDir, this.context.modulePath, '..');
        // get parent module's name
        parentModuleName = path.basename(parentDir);

        filePathToCheck = path.join(this.context.appDir, this.context.modulePath, '..', parentModuleName);
      }

      // get module path
      filePath = utils.findModuleFile(filePathToCheck);

      // if adding dep to app file, then dep is `module
      // else dep is `parent.module`
      depName = (this.context.parentModuleName ? this.context.parentModuleName + '.' : '') + this.context.lowerCamel;
      // add dep and save modifications
      fs.writeFileSync(filePath, ngAddDep(fs.readFileSync(filePath, 'utf8'), depName));

      // create new module
      moduleDest = path.join(this.context.appDir, this.context.modulePath, this.context.hyphenModule);
      this.copySrcFile('module', `${moduleDest}-module.${this.context.appScript}`, this.context);
      if (this.options && !this.options.empty) {
        this.copySrcFile('module-routes', `${moduleDest}-routes.${this.context.appScript}`, this.context);
      }
    };
  }

  get end() {
    return function () {
      if (this.options && !this.options.empty) {
        this.composeWith('ng-poly:route', {
          args: [utils.lowerCamel(this.module.split(/[\/\\]/).pop())],
          options: {
            module: this.module,
            url: '/' + this.context.hyphenModule,
            'template-url': `${this.context.modulePath}/` +
              `${(this.context.structure === 'module-type' ? 'views/' : '')}${this.context.hyphenModule}.tpl.html`,

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
          local: require.resolve('../route'),
          link: 'strong'
        });
      }
    };
  }
}
