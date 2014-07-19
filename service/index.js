'use strict';
var genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_service.js', 'src/js/services/' + config.lowerCamel + '.js', config);
  this.template('_spec.' + config.testScript,
    'tests/unit/services/' + config.lowerCamel + '.spec.' + config.testScript, config);
};