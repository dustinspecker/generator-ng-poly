'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var viewName = utils.lowerCamel(this.name);
  var markup = this.config.get('markup');

  var context = {
    viewName: viewName
  };

  this.template('_view.' + markup, 'src/markup/views/' + viewName + '.' + markup, context);
};