'use strict';
var genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_controller.js', 'src/js/controllers/' + config.ctrlName + '.js', config);
  this.template('_spec.' + config.testScript,
    'tests/unit/controllers/' + config.ctrlName + '.spec.' + config.testScript, config);
};