'use strict';
var genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_directive.js', 'src/js/directives/' + config.lowerCamel + '.js', config);
  this.template('_directive.' + config.markup,
    'src/markup/templates/' + config.lowerCamel + '.' + config.markup, config);
  this.template('_spec.' + config.testScript,
    'tests/unit/directives/' + config.lowerCamel + '.spec.' + config.testScript, config);
};