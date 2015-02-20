'use strict';
var _ = require('lodash')
  , path = require('path')
  , pkg = require(path.join(__dirname, '../package.json'))
  , recursiveReaddir = require('recursive-readdir')
  , updateNotifier = require('update-notifier')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator')
  , Generator;

Generator = module.exports = yeoman.generators.NamedBase.extend();

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
        var done = this.async();
        recursiveReaddir(utils.getAppDir(), function (err, files) {
          if (err) {
            throw err;
          }
          // remove non-script files
          // will remove folders such as fonts, images, styles
          // not 100% full proof, as a user to could create a directory with a script file that's
          // not part of a module
          files = files.filter(function (file) {
            return file.indexOf('.coffee') >= 0 || file.indexOf('.js') >= 0 || file.indexOf('.ts') >= 0;
          });
          // only get the directories
          files = files.map(function (file) {
            return path.dirname(file);
          });
          // remove duplicates
          files = _.uniq(files);
          // display full name as name, but remove app/ from value
          files = files.map(function (file) {
            return {
              name: file,
              value: file.replace(utils.getAppDir() + '\\', '').replace(utils.getAppDir() + '/', '')
            };
          });
          done(files);
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
        return ((params && params.url) && !this.config.get('ngRoute') && !(this.options && this.options.url));
      }.bind(this)
    },
    {
      name: 'templateUrl',
      message: 'What\'s the templateURL for this route?',
      default: function (answers) {
        var module = answers.module || this.options.module;
        return utils.normalizeModulePath(module) + '/' + utils.hyphenName(this.name.replace('.', '-')) + '.tpl.html';
      }.bind(this),
      when: function () {
        return ((params && params.templateUrl) && !(this.options && this.options['template-url']));
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
    if (!/[.]tpl[.]html$/.test(this.templateUrl)) {
      this.templateUrl = this.templateUrl + '.tpl.html';
    }

    done();
  }.bind(this));
};

Generator.prototype.getConfig = function getConfig() {
  var config = {
    markup: this.options.markup || this.config.get('markup'),
    appScript: this.options['app-script'] || this.config.get('appScript'),
    controllerAs: (this.options['controller-as'] !== undefined && this.options['controller-as'] !== null) ?
      this.options['controller-as'] : this.config.get('controllerAs'),

    skipController: (this.options['skip-controller'] !== undefined && this.options['skip-controller'] !== null) ?
      this.options['skip-controller'] : this.config.get('skipController'),

    passFunc: (this.options['pass-func'] !== undefined && this.options['pass-func'] !== null) ?
      this.options['pass-func'] : this.config.get('passFunc'),

    namedFunc: (this.options['named-func'] !== undefined && this.options['named-func'] !== null) ?
      this.options['named-func'] : this.config.get('namedFunc'),

    testScript: this.options['test-script'] || this.config.get('testScript'),
    testFramework: this.config.get('testFramework'),
    e2eTestFramework: this.config.get('e2eTestFramework') || 'jasmine',
    style: this.options.style || this.config.get('style'),
    ngRoute: (this.options['ng-route'] !== undefined && this.options['ng-route'] !== null) ?
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

  if (this.module) {
    modules = utils.extractModuleNames(this.module);
    config.modulePath = utils.normalizeModulePath(this.module);
    config.moduleName = utils.lowerCamel(modules[0]);
    config.parentModuleName = utils.lowerCamel(modules[1]);

    if (config.appScript === 'ts') {
      config.referencePath = path.relative(config.modulePath, path.dirname(this.config.path));
      config.referencePath = config.referencePath.replace('\\', '/');
      config.referencePath = '../' + config.referencePath + '/typings/tsd.d.ts';
    }
  }

  return config;
};

Generator.prototype.simpleCopy = function simplyCopy(src, dest, context) {
  if (!context) {
    context = this.getConfig();
  }

  this.fs.copyTpl(
    this.templatePath(src),
    this.destinationPath(dest),
    context
  );
};

Generator.prototype.copyMarkup = function copyMarkup(type, dest, context) {
  var config = this.getConfig();
  if (typeof dest === 'object') {
    context = dest;
    dest = null;
  }
  if (!dest) {
    dest = path.join(config.appDir, config.modulePath, config.hyphenName + '-' + type + '.tpl.' + config.markup);
  }

  this.simpleCopy('_' + type + '.' + config.markup, dest, context);
};

Generator.prototype.copySrc = function copySrc(type, dest, context) {
  var config = this.getConfig();
  if (typeof dest === 'object') {
    context = dest;
    dest = null;
  }
  if (!dest) {
    dest = path.join(config.appDir, config.modulePath, config.hyphenName + '-' + type + '.' + config.appScript);
  }

  this.simpleCopy('_' + type + '.' + config.appScript, dest, context);
};

Generator.prototype.copyUnitTest = function copyUnitTest(type, dest, context) {
  var config = this.getConfig();
  if (typeof dest === 'object') {
    context = dest;
    dest = null;
  }
  if (!dest) {
    dest = path.join(config.testDir, config.modulePath, config.hyphenName + '-' + type + '_test.' + config.testScript);
  }

  this.simpleCopy('_spec.' + config.testScript, dest, context);
};

Generator.prototype.copyE2e = function copyE2e(context) {
  var testScript = (context.testScript === 'ts' ? 'js' : context.testScript);
  this.simpleCopy(
    'page.po.' + testScript,
    'e2e/' + context.hyphenName + '/' + context.hyphenName + '.po.' + testScript,
    context
  );
  this.simpleCopy(
    'page_test.' + testScript,
    'e2e/' + context.hyphenName + '/' + context.hyphenName + '_test.' + testScript,
    context
  );
};

Generator.extend = require('class-extend').extend;
