'use strict';
import {Base} from 'yeoman-generator';
import path from 'path';
import pkg from '../../package.json';
import recursiveReaddir from 'recursive-readdir';
import updateNotifier from 'update-notifier';
import utils from '../utils';

export default class GenBase extends Base {
  constructor(...args) {
    super(...args);
    this.name = args['0'][0];
  }

  askForModuleName(params) {
    const done = this.async()
      , notifier = updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
      });

    // notifiy user about update, if there is an update
    notifier.notify();

    this.prompt([
      {
        type: 'list',
        name: 'module',
        store: true,
        message: 'Which module is this for?',
        default: this.config.get('lastUsedModule'),
        when: () => !(this.options && this.options.module),
        choices() {
          // console.log(this.config);
          const moduleDone = this.async();

          recursiveReaddir(utils.getAppDir(), (err, files) => {
            if (err) {
              throw err;
            }
            moduleDone(utils.moduleFilter(files));
          });
        }
      },
      {
        name: 'url',
        message: 'What\'s the URL for this route?',
        default: () => {
          // if child state return child portion as url
          if (this.name.indexOf('.') > -1) {
            return '/' + utils.hyphenName(this.name.split('.')[1]);
          }
          return '/' + utils.hyphenName(this.name);
        },
        when: () => params && params.url && !this.config.get('ngRoute') && !(this.options && this.options.url)
      },
      {
        name: 'templateUrl',
        message: 'What\'s the templateURL for this route?',
        default: answers => {
          const module = answers.module || this.options.module;

          return utils.normalizeModulePath(module) + '/' +
            (this.options.structure === 'module-type' ||
              this.config.get('structure') === 'module-type' ? 'views/' : '') +
            utils.hyphenName(this.name.replace('.', '-')) + '.tpl.html';
        },
        when: () => params && params.templateUrl && !(this.options && this.options['template-url'])
      }
    ], (props) => {
      this.module = props.module || this.options.module;
      this.url = props.url || this.options.url || this.name;
      this.templateUrl = props.templateUrl || this.options['template-url'];

      // if moduleName ends with a slash remove it
      if (this.module.charAt(this.module.length - 1) === '/' || this.module.charAt(this.module.length - 1) === '\\') {
        this.module = this.module.slice(0, this.module.length - 1);
      }

      // prepend slash if missing
      if (this.url && (this.url.charAt(0) !== '/' && this.url.charAt(0) !== '\\')) {
        this.url = '/' + this.url;
      }

      // convert backslashes to forwardslashes for Windows
      if (this.templateUrl) {
        this.templateUrl = this.templateUrl.replace('\\', '/');
      }

      // append .tpl.html if not existing
      if (!(/[.]tpl[.]html$/).test(this.templateUrl)) {
        this.templateUrl = this.templateUrl + '.tpl.html';
      }

      done();
    });
  }

  getConfig() {
    let config, modules;

    config = {
      name: this.name,
      markup: this.options.markup || this.config.get('markup'),
      appScript: this.options['app-script'] || this.config.get('appScript'),

      structure: this.options.structure || this.config.get('structure'),
      controllerAs: this.config.get('controllerAs'),

      directiveTemplateUrl: this.options['directive-template-url'] !== undefined && this.options['directive-template-url'] !== null ?
        this.options['directive-template-url'] : this.config.get('directiveTemplateUrl'),

      skipController: this.options['skip-controller'] !== undefined && this.options['skip-controller'] !== null ?
        this.options['skip-controller'] : this.config.get('skipController'),

      testScript: this.options['test-script'] || this.config.get('testScript'),
      testFramework: this.config.get('testFramework'),
      e2eTestFramework: this.config.get('e2eTestFramework'),
      style: this.options.style || this.config.get('style'),
      ngRoute: this.config.get('ngRoute'),

      appName: utils.getAppName(this.config.path),
      appDir: utils.getAppDir(this.config.path),
      testDir: utils.getUnitTestDir(this.config.path),
      ctrlName: utils.ctrlName(this.name),
      humanName: utils.humanName(this.name),
      hyphenName: utils.hyphenName(this.name),
      lowerCamel: utils.lowerCamel(this.name),
      upperCamel: utils.upperCamel(this.name)
    };

    // only run for Angular components
    if (this.module) {
      modules = utils.extractModuleNames(this.module);
      config.modulePath = utils.normalizeModulePath(this.module);
      config.moduleName = utils.lowerCamel(modules[0]);
      config.parentModuleName = utils.lowerCamel(modules[1]);

      // create reference path to typings/tsd.d.ts from generated file
      if (config.appScript === 'ts') {
        // relative path between module path
        config.referencePath = path.relative(config.modulePath, path.dirname(this.config.path));
        // replace Windows path separators with Unix
        config.referencePath = config.referencePath.replace('\\', '/');
        config.referencePath = '../' + config.referencePath + '/typings/tsd.d.ts';
        // if module/type structure we need to go up one more folder
        if (config.structure === 'module-type' && !this.isModule) {
          config.referencePath = '../' + config.referencePath;
        }
      }
    }

    return config;
  }

  copyFile(type, component, dest, context) {
    let pluralComponent = component === 'factory' ? 'factories' : component + 's'
      , fileName, src;

    if (typeof dest === 'object') {
      context = dest;
      dest = null;
    }
    context = context || this.getConfig();
    if (!dest) {
      // test or app directory?
      dest = type === 'unit' ? context.testDir : context.appDir;
      // append module path and type (if using module-type)
      dest = path.join(dest, context.modulePath,
        component !== 'module' && context.structure === 'module-type' ? pluralComponent : '');

      // create file name
      fileName = context.hyphenName + '-' + component;
      if (type === 'markup') {
        fileName += '.tpl.' + context.markup;
      }
      if (type === 'src') {
        fileName += '.' + context.appScript;
      }
      if (type === 'unit') {
        fileName += '_test.' + context.testScript;
      }
      // style types ALWAYS send a dest

      // append file name to dest
      dest = path.join(dest, fileName);
    }

    if (type === 'markup') {
      src = '_' + component + '.' + context.markup;
    }
    if (type === 'src') {
      src = '_' + component + '.' + context.appScript;
    }
    if (type === 'style') {
      src = component + '.' + context.style;
    }
    if (type === 'unit') {
      src = '_spec.' + context.testScript;
    }

    this.copySimpleFile(src, dest, context);
  }

  copySimpleFile(src, dest, context) {
    context = context || this.context;
    // remove underscore from templated file names
    dest = dest || src.replace(/_/g, '');

    this.fs.copyTpl(
      this.templatePath(src),
      this.destinationPath(dest),
      context
    );
  }

  copyMarkupFile(component, dest, context) {
    return this.copyFile('markup', component, dest, context);
  }

  copySrcFile(component, dest, context) {
    return this.copyFile('src', component, dest, context);
  }

  copyStyleFile(component, dest, context) {
    return this.copyFile('style', component, dest, context);
  }

  copyUnitTest(component, dest, context) {
    return this.copyFile('unit', component, dest, context);
  }

  copyE2e(context) {
    const testScript = context.testScript === 'ts' ? 'js' : context.testScript
      , e2eFile = path.join('e2e', context.hyphenName, context.hyphenName);

    this.copySimpleFile('page.po.' + testScript, e2eFile + '.po.' + testScript, context);
    this.copySimpleFile('page_test.' + testScript, e2eFile + '_test.' + testScript, context);
  }
}
