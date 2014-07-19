'use strict';
var genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_provider.js', 'src/js/providers/' + config.lowerCamel + '.js', config);
  this.template('_spec.' + config.testScript,
    'tests/unit/providers/' + config.lowerCamel + '.spec.' + config.testScript, config);
};