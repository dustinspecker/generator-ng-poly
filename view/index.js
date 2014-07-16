'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var viewName = utils.lowerCamel(this.name);

  var context = {
    viewName: viewName
  };

  this.template('_view.jade', 'src/jade/views/' + viewName + '.jade', context);
};