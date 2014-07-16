'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

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