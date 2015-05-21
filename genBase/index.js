'use strict';
var _ = require('lodash')
  , path = require('path')
  , pkg = require(path.join(__dirname, '../package.json'))
  , recursiveReaddir = require('recursive-readdir')
  , updateNotifier = require('update-notifier')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator')
  , Generator;

Generator = module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.name = arguments['0'][0];
  }
});

Generator.prototype.askForModuleName = function askForModuleName(params) {
  var done = this.async()
    , notifier;

  // check for updates async
  notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
  });

  // notifiy user about update, if there is an update
  notifier.notify();

  this.prompt([
    {
      type: 'list',
      name: 'module',
      message: 'Which module is this for?',
      default: this.config.get('lastUsedModule'),
      when: function () {
        return !(this.options && this.options.module);
      }.bind(this),
      choices: function () {
        var moduleDone = this.async();
        recursiveReaddir(utils.getAppDir(), function (err, files) {
          if (err) {
            throw err;
          }
          // remove non-script files
          // will remove folders such as fonts, images, styles
          // not 100% full proof, as a user could create a directory with a script file that's
          // not part of a module
          files = files.filter(function (file) {
            return file.indexOf('.coffee') >= 0 || file.indexOf('.js') >= 0 ||
              file.indexOf('.ts') >= 0 || file.indexOf('.es6') >= 0;
          });
          // only get the directories
          files = files.map(function (file) {
            return path.dirname(file);
          });
          // remove duplicates
          files = _.uniq(files);
          // remove components and types folder
          files = files.filter(function (file) {
            var ignoreDirectories = ['components', 'constants', 'controllers', 'decorators', 'directives', 'factories',
              'filters', 'services', 'providers', 'values', 'views']
              , i;
            for (i = 0; i < ignoreDirectories.length; i++) {
              if (file.indexOf(ignoreDirectories[i]) > -1) {
                return false;
              }
            }
            return true;
          });
          // display full name as name, but remove app/ from value
          files = files.map(function (file) {
            return {
              name: file,
              value: file.replace(utils.getAppDir() + '\\', '').replace(utils.getAppDir() + '/', '')
            };
          });
          moduleDone(files);
        });
      }
    },
    {
      name: 'url',
      message: 'What\'s the URL for this route?',
      default: function () {
        // if child state return child portion as url
        if (this.name.indexOf('.') > -1) {
          return '/' + utils.hyphenName(this.name.split('.')[1]);
        }
        return '/' + utils.hyphenName(this.name);
      }.bind(this),
      when: function () {
        return params && params.url && !this.config.get('ngRoute') && !(this.options && this.options.url);
      }.bind(this)
    },
    {
      name: 'templateUrl',
      message: 'What\'s the templateURL for this route?',
      default: function (answers) {
        var module = answers.module || this.options.module;

        return utils.normalizeModulePath(module) + '/' +
          ((this.options.structure === 'module-type' ||
            this.config.get('structure') === 'module-type') ? 'views/' : '') +
          utils.hyphenName(this.name.replace('.', '-')) + '.tpl.html';
      }.bind(this),
      when: function () {
        return params && params.templateUrl && !(this.options && this.options['template-url']);
      }.bind(this)
    }
  ], function (props) {
    this.module = props.module || this.options.module;
    this.url = props.url || this.options.url || this.name;
    this.templateUrl = props.templateUrl || this.options['template-url'];

    // if moduleName ends with a slash remove it
    if (this.module.charAt(this.module.length - 1) === '/' || this.module.charAt(this.module.length - 1) === '\\') {
      this.module = this.module.slice(0, this.module.length - 1);
    }

    // save this module to suggest later
    this.config.set('lastUsedModule', this.module);

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
  }.bind(this));
};

Generator.prototype.getConfig = function getConfig() {
  var config = {
    name: this.name,
    markup: this.options.markup || this.config.get('markup'),
    appScript: this.options['app-script'] || this.config.get('appScript'),

    structure: this.options.structure || this.config.get('structure'),
    controllerAs: this.options['controller-as'] !== undefined && this.options['controller-as'] !== null ?
      this.options['controller-as'] : this.config.get('controllerAs'),

    skipController: this.options['skip-controller'] !== undefined && this.options['skip-controller'] !== null ?
      this.options['skip-controller'] : this.config.get('skipController'),

    testScript: this.options['test-script'] || this.config.get('testScript'),
    testFramework: this.config.get('testFramework'),
    e2eTestFramework: this.config.get('e2eTestFramework'),
    style: this.options.style || this.config.get('style'),
    ngRoute: this.options['ng-route'] !== undefined && this.options['ng-route'] !== null ?
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
};

Generator.prototype.copyFile = function copyFile(type, component, dest, context) {
  var pluralComponent = component === 'factory' ? 'factories' : component + 's'
    , fileName, src;

  if (typeof dest === 'object') {
    context = dest;
    dest = null;
  }
  context = context || this.getConfig();
  if (!dest) {
    // test or app directory?
    dest = (type === 'unit') ? context.testDir : context.appDir;
    // append module path and type (if using module-type)
    dest = path.join(dest, context.modulePath,
      (component !== 'module' && context.structure === 'module-type') ? pluralComponent : '');

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
};

Generator.prototype.copySimpleFile = function copySimpleFile(src, dest, context) {
  context = context || this.context;
  // remove underscore from templated file names
  dest = dest || src.replace(/_/g, '');

  this.fs.copyTpl(
    this.templatePath(src),
    this.destinationPath(dest),
    context
  );
};

Generator.prototype.copyMarkupFile = function copyMarkupFile(component, dest, context) {
  return this.copyFile('markup', component, dest, context);
};

Generator.prototype.copySrcFile = function copySrcFile(component, dest, context) {
  return this.copyFile('src', component, dest, context);
};

Generator.prototype.copyStyleFile = function copyStyleFile(component, dest, context) {
  return this.copyFile('style', component, dest, context);
};

Generator.prototype.copyUnitTest = function copyUnitTest(component, dest, context) {
  return this.copyFile('unit', component, dest, context);
};

Generator.prototype.copyE2e = function copyE2e(context) {
  var testScript = context.testScript === 'ts' ? 'js' : context.testScript
    , e2eFile = path.join('e2e', context.hyphenName, context.hyphenName);
  this.copySimpleFile('page.po.' + testScript, e2eFile + '.po.' + testScript, context);
  this.copySimpleFile('page_test.' + testScript, e2eFile + '_test.' + testScript, context);
};

Generator.extend = require('class-extend').extend;
