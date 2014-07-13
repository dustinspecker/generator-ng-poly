'use strict';
var util = require('util')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.addView = function addView() {
  var viewName = utils.lowerCamel(this.name);

  var context = {
    viewName: viewName
  };

  this.template('_view.jade', 'src/jade/views/' + viewName + '.jade', context);
};