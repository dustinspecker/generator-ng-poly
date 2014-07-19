'use strict';
var genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_constant.js', 'src/js/constants/' + config.lowerCamel + '.js', config);
  this.template('_spec.' + config.testScript,
    'tests/unit/constants/' + config.lowerCamel + '.spec.' + config.testScript, config);
};