'use strict';
var utils = require('../utils')
  , yeoman = require('yeoman-generator');


var Generator = module.exports = yeoman.generators.NamedBase.extend();

Generator.prototype.writing = function writing() {
  var appName = utils.getAppName(this.config.path);
  var serviceName = utils.lowerCamel(this.name);
  var upperServiceName = utils.upperCamel(this.name);

  var context = {
    appName: appName,
    serviceName: serviceName,
    upperServiceName: upperServiceName
  };

  this.template('_service.js', 'src/js/services/' + serviceName + '.js', context);
  this.template('_spec.js', 'tests/unit/services/' + serviceName + '.spec.js', context);
};