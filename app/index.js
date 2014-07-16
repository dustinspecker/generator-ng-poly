'use strict';
var path = require('path')
  , yeoman = require('yeoman-generator')
  , yosay = require('yosay')
  , chalk = require('chalk');


var Generator = module.exports = yeoman.generators.Base.extend();

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.log(yosay('Welcome to ngPoly!'));

  this.prompt([{
    name: 'appName',
    message: 'What is your app\'s name?'
  }], function (props) {
    this.appName = props.appName;

    done();
  }.bind(this));
};

Generator.prototype.configuring = function configuring() {
  // create a directory with appName, unless user is in a directory named appName
  if (this.appName !== this._.last(this.destinationRoot().split(path.sep))) {
    this.destinationRoot(this.appName);
  }

  this.config.save();

  this.context = { appName: this.appName };

  this.template('_bower.json', 'bower.json', this.context);
  this.template('_package.json', 'package.json', this.context);
  this.copy('.editorconfig', '.editorconfig');
  this.copy('gulpfile.js', 'Gulpfile.js');
  this.copy('.jshintrc', '.jshintrc');
};

Generator.prototype.writing = function writing() {
  this.mkdir('src/components/');

  this.mkdir('src/jade/');
  this.template('_index.jade', 'src/jade/index.jade', this.context);
  this.mkdir('src/jade/views/');
  this.template('_main.jade', 'src/jade/views/main.jade', this.context);

  this.mkdir('src/js/');
  this.template('_app.js', 'src/js/app.js');

  this.mkdir('src/less/');
  this.copy('style.less', 'src/less/style.less');
  this.mkdir('src/less/includes/');
  this.copy('variables.less', 'src/less/includes/variables.less');

  this.mkdir('tests/');
};

Generator.prototype.install = function install() {
  if (!this.options['skip-install']) {
    this.installDependencies();
  }
};

Generator.prototype.end = function end() {
  this.invoke('ng-poly:controller', { args: ['main'] });
};