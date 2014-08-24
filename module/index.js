'use strict';
var fs = require('fs')
  , genBase = require('../genBase')
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
  var filePath, file, parentDir, depName;

  this.context = this.getConfig();

  this.context.moduleName = path.basename(this.module);
  this.context.lowerCamel = utils.lowerCamel(this.context.moduleName);
  this.context.hyphenModule = utils.hyphenName(this.context.moduleName);
  this.context.upperModule = utils.upperCamel(this.context.moduleName);
  this.context.parentModuleName = null;
  this.context.templateUrl = path.join(this.module).replace(/\\/g, '/');
  console.log('module:' + this.module);
  this.context.modulePath = utils.normalizeModulePath(this.module);

  // create new module directory
  this.mkdir(path.join('app', this.context.modulePath));

  // check if path and moduleName are the same
  // if yes - get root app.js to prepare adding dep
  // else - get parent app.js to prepare adding dep
  if (this.context.moduleName === this.module) {
    filePath = path.join(this.config.path, '../app/app.js');
  } else {
    parentDir = path.resolve(path.join('app', this.context.modulePath), '..');

    // for templating to create a parent.child module name
    this.context.parentModuleName = path.basename(parentDir);

    filePath = path.join(parentDir, this.context.parentModuleName + '.js');
  }

  file = fs.readFileSync(filePath, 'utf8');

  // save modifications
  depName = (this.context.parentModuleName) ? this.context.parentModuleName + '.' : '';
  depName += this.context.lowerCamel;
  fs.writeFileSync(filePath, utils.addDependency(file, depName));

  // create app.js
  this.template('_app.js', path.join('app', this.context.modulePath, this.context.hyphenModule + '.js'), this.context);
};

Generator.prototype.end = function end() {
  // save this module to suggest later
  this.config.set('lastUsedModule', this.module);

  // prevents done() from being called out of sync
  this.config.forceSave();

  if (this.options && !this.options.empty) {
    this.composeWith('ng-poly:route', {
      args: [this.context.moduleName],
      options: {
        module: this.module,
        url: '/' + this.context.lowerCamel,
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
