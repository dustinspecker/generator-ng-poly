'use strict';
var genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_filter.js', 'src/js/filters/' + config.lowerCamel + '.js', config);
  this.template('_spec.' + config.testScript,
    'tests/unit/filters/' + config.lowerCamel + '.spec.' + config.testScript, config);
};