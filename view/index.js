'use strict';
var genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_view.' + config.markup,
    'src/markup/views/' + config.lowerCamel + '.' + config.markup, config);
};