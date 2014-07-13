'use strict';
var util = require('util')
  , utils = require('../utils')
  , fs = require('fs')
  , path = require('path')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.hookFor('ng-poly:controller', { args: [this.name] });
  this.hookFor('ng-poly:view', { args: [this.name] });
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askQuestions = function askQuestion() {
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

Generator.prototype.addRoute = function addRoute() {
  var viewName = utils.lowerCamel(this.name);
  var ctrlName = utils.ctrlName(this.name);

  // load app.js to prepare adding new state
  var filePath = path.join(process.cwd(), 'src/js/app.js')
    , file = fs.readFileSync(filePath, 'utf8')

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
    '    .state(\'' + viewName + '\', {',
    '      url: \'/' + this.url + '\',',
    '      templateUrl: \'views/' + viewName + '.html\',',
    '      controller: \'' + ctrlName + '\'',
  ];

  // insert new state and join all lines
  lines.splice(lineIndex+1, 0, newState.map(function (line) {
    return line;
  }).join('\n'));

  // save modifications
  fs.writeFileSync(filePath, lines.join('\n'));  
};