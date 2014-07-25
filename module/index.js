'use strict';
var fs = require('fs')
  , genBase = require('../genBase')
  , path = require('path')
  , utils = require('../utils');


var Generator = module.exports = genBase.extend();

Generator.prototype.initialize = function initialize() {
  this.module = this.name;
};

Generator.prototype.writing = function writing() {
  this.context = this.getConfig();

  // if moduleName ends with a slash remove it
  if (this.module.charAt(this.module.length-1) === '/' || this.module.charAt(this.module.length-1) === '\\') {
    this.module = this.module.slice(0, this.module.length-1);
  }

  this.context.moduleName = path.basename(this.module);
  this.context.hyphenModue = utils.hyphenName(this.context.moduleName);
  this.context.upperModule = utils.upperCamel(this.context.moduleName);
  this.context.parentModuleName = null;
  this.context.templateUrl = path.join(this.module).replace(/\\/g, '/');

  // create new module directory
  this.mkdir(path.join('src', this.module));

  var filePath, file;

  // check if path and moduleName are the same
  // if yes - get root app.js to prepare adding dep
  // else - get parent app.js to prepare adding dep
  if (this.context.moduleName === this.module) {
    filePath = path.join(this.config.path, '../src/app.js');
  } else {
    var parentDir = path.resolve(path.join('src', this.module), '..');

    // for templating to create a parent.child module name
    this.context.parentModuleName = path.basename(parentDir);

    filePath = path.join(parentDir, this.context.parentModuleName + '.js');
  }

  file = fs.readFileSync(filePath, 'utf8');

  // find line to add new dependency
  var lines = file.split('\n')
    , angularDefinitionOpenLine = -1
    , angularDefinitionCloseLine = -1;

  lines.forEach(function (line, i) {
    // find line with angular.module('*', [
    if (angularDefinitionOpenLine < 0 && line.indexOf('angular.module') > -1) {
      angularDefinitionOpenLine = i;
    }

    // find line with closing ]);
    if (angularDefinitionOpenLine > -1 && angularDefinitionCloseLine < 0 && line.indexOf(']);') > -1) {
      angularDefinitionCloseLine = i;
    }
  });

  // create moduleName
  // if parent module exists, make it part of module name
  var moduleName;
  if (this.context.parentModuleName) {
    moduleName = '  \'' + this.context.parentModuleName + '.' + this.context.moduleName + '\'';
  } else {
    moduleName =  '  \'' + this.context.moduleName + '\'';
  }

  // remove new line and add a comma to the previous depdendency
  lines[angularDefinitionCloseLine-1] = lines[angularDefinitionCloseLine-1].slice(0, lines[angularDefinitionCloseLine-1].lastIndexOf('\n'));
  lines[angularDefinitionCloseLine-1] = lines[angularDefinitionCloseLine-1] + ',';

  // insert new line and dependency
  lines.splice(angularDefinitionCloseLine, 0, moduleName);

  // save modifications
  fs.writeFileSync(filePath, lines.join('\n'));

  // create app.js
  this.template('_app.js', path.join('src', this.module, this.context.moduleName + '.js'), this.context);
};

Generator.prototype.end = function end() {
  this.invoke('ng-poly:controller', {
    args: [this.context.moduleName],
    options: {
      options: {
        module: this.module
      }
    }
  });
  this.invoke('ng-poly:view', {
    args: [this.context.moduleName],
    options: {
      options: {
        module: this.module
      }
    }
  });
};