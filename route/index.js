'use strict';
var fs = require('fs')
  , join = require('path').join
  , genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.prompt([{
    name: 'url',
    message: 'What\'s the url for this state?',
    default: this.name
  }], function (props) {
    this.url = props.url;

    done();
  }.bind(this));
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  // load app.js to prepare adding new state
  var filePath = join(this.config.path, '../src/js/app.js')
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
    '      templateUrl: \'views/' + config.lowerCamel + '.html\',',
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
  this.invoke('ng-poly:controller', { args: [this.name] });
  this.invoke('ng-poly:view', { args: [this.name] });
};