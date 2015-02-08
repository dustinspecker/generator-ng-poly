'use strict';
var _ = require('lodash')
  , fs = require('fs')
  , genBase = require('../genBase')
  , ngAddDep = require('ng-add-dep')
  , path = require('path')
  , utils = require('../utils')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.initialize = function initialize() {
  this.module = this.name;

  // if moduleName ends with a slash remove it
  if (this.module.charAt(this.module.length - 1) === '/' || this.module.charAt(this.module.length - 1) === '\\') {
    this.module = this.module.slice(0, this.module.length - 1);
  }
};

Generator.prototype.writing = function writing() {
  var filePath, file, parentDir, depName, parentModuleDir;

  this.context = this.getConfig();

  this.context.moduleName = path.basename(this.module);
  this.context.lowerCamel = utils.lowerCamel(this.context.moduleName);
  this.context.hyphenModule = utils.hyphenName(this.context.moduleName);
  this.context.upperModule = utils.upperCamel(this.context.moduleName);
  parentModuleDir = null;
  this.context.templateUrl = path.join(this.module).replace(/\\/g, '/');
  this.context.modulePath = utils.normalizeModulePath(this.module);
  if (this.context.appScript === 'ts') {
    this.context.referncePath = path.relative(this.context.modulePath, path.dirname(this.config.path));
    this.context.referncePath = this.context.referncePath.replace('\\', '/');
    this.context.referncePath = '../' + this.context.referncePath + '/typings/tsd.d.ts';
  }

  // create new module directory
  this.mkdir(path.join(this.context.appDir, this.context.modulePath));

  // check if path and moduleName are the same
  // if yes - get root app.js to prepare adding dep
  // else - get parent app.js to prepare adding dep
  if (this.context.moduleName === this.module) {

    filePath = _.find([
      path.join(this.context.appDir, 'app.ts'),
      path.join(this.context.appDir, 'app.coffee'),
      path.join(this.context.appDir, 'app.js')
    ], function (appFile) {
      return fs.existsSync(appFile);
    });

  } else {
    parentDir = path.resolve(path.join(this.context.appDir, this.context.modulePath), '..');

    // for templating to create a parent.child module name
    parentModuleDir = path.basename(parentDir);

    filePath = _.find([
      path.join(this.context.appDir, this.context.modulePath, '..', parentModuleDir + '.ts'),
      path.join(this.context.appDir, this.context.modulePath, '..', parentModuleDir + '.coffee'),
      path.join(this.context.appDir, this.context.modulePath, '..', parentModuleDir + '.js')
    ], function (appFile) {
      return fs.existsSync(appFile);
    });
  }

  file = fs.readFileSync(filePath, 'utf8');

  // save modifications
  depName = (this.context.parentModuleName) ? this.context.parentModuleName + '.' : '';
  depName += this.context.lowerCamel;
  fs.writeFileSync(filePath, ngAddDep(file, depName));

  // create app.{cofee,js,ts}
  this.fs.copyTpl(
    this.templatePath('_app.' + this.context.appScript),
    this.destinationPath(this.context.appDir + '/' + this.context.modulePath + '/' + this.context.hyphenModule +
      '.' + this.context.appScript),
    this.context
  );
};

Generator.prototype.end = function end() {
  // save this module to suggest later
  this.config.set('lastUsedModule', this.module);

  if (this.options && !this.options.empty) {
    this.composeWith('ng-poly:route', {
      args: [utils.lowerCamel(this.module.split(/[\/\\]/).pop())],
      options: {
        module: this.module,
        url: '/' + this.context.hyphenModule,
        'template-url': this.context.modulePath + '/' + this.context.hyphenModule + '.tpl.html',

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
