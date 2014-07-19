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
  this.context.moduleName = path.basename(this.name);
  this.context.upperModule = utils.upperCamel(this.context.moduleName);

  this.mkdir('src/' + this.module);
  this.template('_app.js', path.join('src', this.module, this.context.moduleName + '.js'), this.context);

  // load app.js to add new dependency
  var filePath = path.join(this.config.path, '../src/app.js')
    , file = fs.readFileSync(filePath, 'utf8');

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

  // add dependency and closing bracket
  lines[lineIndex] = lines[lineIndex] + ', \'' + this.context.moduleName + '\']);';

  // save modifications
  fs.writeFileSync(filePath, lines.join('\n'));
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