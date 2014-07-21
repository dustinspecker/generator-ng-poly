'use strict';
var fs = require('fs')
  , genBase = require('../genBase')
  , path = require('path')
  , utils = require('../utils');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.prompt([{
    name: 'module',
    message: 'What is the module\'s name?',
    when: function () {
      return !this.name;
    }.bind(this)
  }], function (props) {
    this.module = props.module || this.name;

    done();
  }.bind(this));
};

Generator.prototype.writing = function writing() {
  this.context = this.getConfig();

  // if moduleName ends with a slash remove it
  if (this.module.charAt(this.module.length-1) === '/' || this.module.charAt(this.module.length-1) === '\\') {
    this.module = this.module.slice(0, this.module.length-1);
  }

  this.context.moduleName = path.basename(this.module);
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
    , lineIndex = 0;

  lines.forEach(function (line, i) {
    // fine line that sets the dependencies of the module
    if (line.indexOf('angular.module') !== -1 && line.indexOf(']') !== -1) {
      lineIndex = i;
    }
  });

  // remove closing bracket and on
  lines[lineIndex] = lines[lineIndex].slice(0, lines[lineIndex].indexOf(']'));

  // determine if module has any other dependencies
  // if yes, we need to add a , and space before the new depcency
  if (lines[lineIndex].charAt(lines[lineIndex].length-1) !== '[') {
    lines[lineIndex] = lines[lineIndex] + ', ';
  }

  // add dependency and closing bracket
  // if parent module exists, make it part of module name
  if (this.context.parentModuleName) {
    lines[lineIndex] = lines[lineIndex] + '\'' + this.context.parentModuleName + '.' + this.context.moduleName + '\']);';
  } else {
    lines[lineIndex] = lines[lineIndex] + '\'' + this.context.moduleName + '\']);';
  }

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