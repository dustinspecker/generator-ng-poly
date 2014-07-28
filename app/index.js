'use strict';
var path = require('path')
  , yeoman = require('yeoman-generator')
  , yosay = require('yosay');


var Generator = module.exports = yeoman.generators.Base.extend();

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.log(yosay('Welcome to ngPoly!'));

  // ask for app name
  // get preferred langugaes
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
    type: 'confirm',
    name: 'controllerAs',
    message: 'Want to use Controller As syntax?',
    default: true
  },
  {
    type: 'confirm',
    name: 'namedFunc',
    message: 'Want to use named functions?',
    default: true
  },
  {
    type: 'list',
    name: 'testScript',
    message: 'What is the preferred test scripting language?',
    choices: [
      {
        name: 'CoffeeScript',
        value: 'coffee'
      },
      {
        name: 'JavaScript',
        value: 'js',
        checked: true
      }
    ]
  },
  {
    type: 'list',
    name: 'testDir',
    message: 'Where should tests be saved?',
    choices: [
      {
        name: 'src/',
        value: 'src',
        checked: true
      },
      {
        name: 'test/',
        value: 'test'
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
    this.controllerAs = props.controllerAs;
    this.namedFunc = props.namedFunc;
    this.testScript = props.testScript;
    this.testDir = props.testDir;
    this.style = props.style;

    done();
  }.bind(this));

};

Generator.prototype.configuring = function configuring() {
  // create a directory with appName, unless user is in a directory named appName
  if (this.appName !== this._.last(this.destinationRoot().split(path.sep))) {
    this.destinationRoot(this.appName);
  }

  // save config info
  this.config.set('markup', this.markup);
  this.config.set('appScript', this.appScript);
  this.config.set('controllerAs', this.controllerAs);
  this.config.set('namedFunc', this.namedFunc);
  this.config.set('testScript', this.testScript);
  this.config.set('testDir', this.testDir);
  this.config.set('style', this.style);
  this.config.save();

  this.context = { 
    appName: this.appName,
    moduleName: this.appName,
    namedFunc: this.namedFunc
  };

  // copy over common files
  this.template('_bower.json', 'bower.json', this.context);
  this.template('_package.json', 'package.json', this.context);
  this.copy('.editorconfig', '.editorconfig');
  this.copy('gulpfile.js', 'Gulpfile.js');
  this.copy('karma.config.json', 'karma.config.json');
  this.copy('.jshintrc', '.jshintrc');
};

Generator.prototype.writing = function writing() {
  var markup = this.config.get('markup');

  // create main module and index.html
  this.template('_app.js', 'src/app.js', this.context);
  this.template('_index.' + markup, 'src/index.' + markup, this.context);

/*  // create a home module
  this.mkdir('src/home');
  this.template('_app.js', 'src/home/home.js', this.context);

  // create a home view, controller, and route
  this.template('_index.' + markup, 'src/home/home.' + markup, this.context);
  this.copy('style.less', 'src/home/home.less');*/
};

Generator.prototype.install = function install() {
  if (!this.options['skip-install']) {
    this.installDependencies();
  }
};

Generator.prototype.end = function end() {
  // force save to guarantee config exists for controller
  // tests randomly fail without this
  this.config.forceSave();

  this.invoke('ng-poly:module', {
    args: ['home'],
    options: {
      options: {
        module: 'home',
      }
    }
  });
};