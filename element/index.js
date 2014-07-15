'use strict';
var util = require('util')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.writing = function writing() {
  var elementName = utils.hyphenName(this.name);

  var context = {
    elementName: elementName
  };

  var elementDir = 'src/components/' + elementName + '/';
  this.mkdir(elementDir);
  this.copy('element.less', elementDir + elementName + '.less');
  this.template('_element.jade', elementDir + elementName + '.jade', context);
  this.template('_element.js', elementDir + elementName + '.js', context);
};