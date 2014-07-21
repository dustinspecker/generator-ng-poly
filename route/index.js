'use strict';
var fs = require('fs')
  , join = require('path').join
  , genBase = require('../genBase')
  , utils = require('../utils');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.prompt([{
    name: 'module',
    message: 'Which module is this for?'
  },
  {
    name: 'url',
    message: 'What\'s the url for this state?',
    default: this.name,
  }], function (props) {
    this.module = props.module;
    this.url = props.url;

    done();
  }.bind(this));
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  utils.moduleExists(this.config.path, this.module);

  var modules = utils.extractModuleNames(this.module);
  config.moduleName = modules[0];
  config.parentModuleName = modules[1];
  config.modulePath = this.module.replace('.', '/');

  // load app.js to prepare adding new state
  var filePath = join(this.config.path, '../src/', config.modulePath, config.moduleName + '.js')
    , file = fs.readFileSync(filePath, 'utf8');

  // find line to add new state
  var lines = file.split('\n')
    , lineIndex = 0;
  lines.forEach(function (line, i) {
    if (line.indexOf('controller:') !== -1) {
      lineIndex = i;
    }
  });

  // create new state
  var newState = [
    '    })',
    '    .state(\'' + config.lowerCamel + '\', {',
    '      url: \'/' + this.url + '\',',
    '      templateUrl: \'' + this.module + '/' + config.lowerCamel + '.tpl.html\',',
    '      controller: \'' + config.ctrlName + '\'',
  ];

  // insert new state and join all lines
  lines.splice(lineIndex+1, 0, newState.map(function (line) {
    return line;
  }).join('\n'));

  // save modifications
  fs.writeFileSync(filePath, lines.join('\n'));
};

Generator.prototype.end = function end() {
  this.invoke('ng-poly:controller', {
    args: [this.name],
    options: {
      options: {
        module: this.module
      }
    }
  });
  this.invoke('ng-poly:view', {
    args: [this.name],
    options: {
      options: {
        module: this.module
      }
    }
  });
};