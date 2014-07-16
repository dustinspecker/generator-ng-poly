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
    message: 'What is the app\'s name?'
  },
  {
    type: 'list',
    name: 'markup',
    message: 'What is the preferred markup language?',
    choices: [
      {
        name: 'HTML',
        value: 'html'
      },
      {
        name: 'Jade',
        value: 'jade',
        checked: true
      }
    ]
  },
  {
    type: 'list',
    name: 'appScript',
    message: 'What is the preferred application scripting language?',
    choices: [
      {
        name: 'JavaScript',
        value: 'js',
        checked: true
      }
    ]
  },
  {
    type: 'list',
    name: 'testScript',
    message: 'What is the preferred test scripting language?',
    choices: [
      {
        name: 'JavaScript',
        value: 'js',
        checked: true
      }
    ]
  },
  {
    type: 'list',
    name: 'style',
    message: 'What is the preferred style language?',
    choices: [
      {
        name: 'LESS',
        value: 'less',
        checked: true
      }
    ]
  }], function (props) {
    this.appName = props.appName;
    this.markup = props.markup;
    this.appScript = props.appScript;
    this.testScript = props.testScript;
    this.style = props.style;

    done();
  }.bind(this));
};

Generator.prototype.configuring = function configuring() {
  // create a directory with appName, unless user is in a directory named appName
  if (this.appName !== this._.last(this.destinationRoot().split(path.sep))) {
    this.destinationRoot(this.appName);
  }

  this.config.set('markup', this.markup);
  this.config.set('appScript', this.appScript);
  this.config.set('testScript', this.testScript);
  this.config.set('style', this.style);
  this.config.save();

  this.context = { appName: this.appName };

  this.template('_bower.json', 'bower.json', this.context);
  this.template('_package.json', 'package.json', this.context);
  this.copy('.editorconfig', '.editorconfig');
  this.copy('gulpfile.js', 'Gulpfile.js');
  this.copy('.jshintrc', '.jshintrc');
};

Generator.prototype.writing = function writing() {
  var markup = this.config.get('markup');

  this.mkdir('src/components/');

  this.mkdir('src/markup/');
  this.template('_index.' + markup, 'src/markup/index.' + markup, this.context);
  this.mkdir('src/markup/views/');
  this.template('_main.' + markup, 'src/markup/views/main.' + markup, this.context);

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