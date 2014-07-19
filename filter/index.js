'use strict';
var genBase = require('../genBase')
  , path = require('path');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.prompt([{
    name: 'module',
    message: 'Which module is this for?',
    default: this.name,
    when: function () {
      return !(this.options && this.options.options && this.options.options.module);
    }.bind(this)
  }], function (props) {
    this.module = props.module || this.options.options.module;

    done();
  }.bind(this));
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  this.template('_filter.js', path.join('src', this.module, config.lowerCamel + 'Filter.js'), config);
  this.template('_spec.' + config.testScript,
    path.join('src', this.module, config.lowerCamel + 'Filter_test.' + config.testScript), config);
};