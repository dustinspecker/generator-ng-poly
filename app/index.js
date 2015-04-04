'use strict';
var _ = require('lodash')
  , chalk = require('chalk')
  , genBase = require('../genBase')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , utils = require('../utils')
  , yosay = require('yosay')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.initializing = function initializing() {
  this.host = 'localhost';
  this.port = 3000;
  this.appDir = 'app';
  this.unitTestDir = 'app';

  if (this.options.host) {
    this.host = this.options.host;
    console.log(chalk.yellow('Using host: ' + this.host));
  }

  if (this.options.port) {
    this.port = this.options.port;
    console.log(chalk.yellow('Using port: ' + this.port));
  }

  if (this.options['app-dir']) {
    this.appDir = this.options['app-dir'];
    console.log(chalk.yellow('Using app directory: ' + this.appDir));
  }

  if (this.options['unit-test-dir']) {
    this.unitTestDir = this.options['unit-test-dir'];
    console.log(chalk.yellow('Using unit test directory: ' + this.unitTestDir));
  }
};

Generator.prototype.prompting = function prompting() {
  var done = this.async();

  this.log(yosay('Welcome to ngPoly!'));

  // ask for app name
  // get preferred langugaes
  this.prompt([
    {
      name: 'appName',
      message: 'What is the app\'s name?',
      validate: function (input) {
        // require an app name
        return !!input;
      }
    },
    {
      type: 'list',
      name: 'ngversion',
      message: 'Which version of Angular should be used?',
      default: '1.3.*',
      choices: [
        {
          name: '1.2.*',
          value: '1.2.*'
        },
        {
          name: '1.3.*',
          value: '1.3.*'
        }
      ]
    },
    {
      type: 'list',
      name: 'structure',
      message: 'Which structure should be used?',
      default: 'module-only',
      choices: [
        {
          name: ['app/',
                '├── module1/',
                '│   ├── module2/',
                '│   ├── module1.js',
                '│   └── module1-controller.js',
                '└── app.js'].join('\n'),
          value: 'module-only'
        },
        {
          name: ['app/',
                '├── module1/',
                '│   ├── controllers/',
                '│   │   └── module1-controller.js',
                '│   ├── module2/',
                '│   └── module1.js',
                '└── app.js'].join('\n'),
          value: 'module-type'
        }
      ]
    },
    {
      type: 'list',
      name: 'markup',
      message: 'Which is the preferred markup language?',
      default: 'jade',
      choices: [
        {
          name: 'HAML',
          value: 'haml'
        },
        {
          name: 'HTML',
          value: 'html'
        },
        {
          name: 'Jade',
          value: 'jade'
        }
      ]
    },
    {
      type: 'list',
      name: 'appScript',
      message: 'Which is the preferred application scripting language?',
      default: 'js',
      choices: [
        {
          name: 'CoffeeScript',
          value: 'coffee'
        },
        {
          name: 'EcmaScript2015 (ES6) using Babel',
          value: 'es6'
        },
        {
          name: 'JavaScript (ES5)',
          value: 'js'
        },
        {
          name: 'TypeScript',
          value: 'ts'
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
      name: 'skipController',
      message: 'By default, should the route generator create controllers?',
      default: true
    },
    {
      type: 'list',
      name: 'testScript',
      message: 'Which is the preferred test scripting language?',
      default: function (answers) {
        return answers.appScript;
      },
      choices: [
        {
          name: 'CoffeeScript',
          value: 'coffee'
        },
        {
          name: 'EcmaScript2015 (ES6) using Babel',
          value: 'es6'
        },
        {
          name: 'JavaScript (ES5)',
          value: 'js'
        },
        {
          name: 'TypeScript',
          value: 'ts'
        }
      ]
    },
    {
      type: 'list',
      name: 'testFramework',
      message: 'Which is the preferred unit testing framework?',
      default: 'jasmine',
      choices: [
        {
          name: 'Jasmine',
          value: 'jasmine'
        },
        {
          name: 'Mocha with Chai',
          value: 'mocha'
        }
      ]
    },
    {
      type: 'list',
      name: 'e2eTestFramework',
      message: 'Which is the preferred e2e testing framework?',
      default: function (answers) {
        return answers.testFramework;
      },
      choices: [
        {
          name: 'Jasmine',
          value: 'jasmine'
        },
        {
          name: 'Mocha with Chai',
          value: 'mocha'
        }
      ]
    },
    {
      type: 'list',
      name: 'style',
      message: 'Which is the preferred style language?',
      default: 'less',
      choices: [
        {
          name: 'CSS',
          value: 'css'
        },
        {
          name: 'LESS',
          value: 'less'
        },
        {
          name: 'SCSS',
          value: 'scss'
        },
        {
          name: 'Stylus',
          value: 'styl'
        }
      ]
    },
    {
      type: 'confirm',
      name: 'polymer',
      message: 'Should Polymer support be enabled?',
      default: false
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Should a framework be setup?',
      choices: function (answers) {
        var choices = [
          {
            name: 'none',
            value: 'none'
          },
          {
            name: 'Bootstrap with AngularStrap',
            value: 'angularstrap'
          },
          {
            name: 'Foundation with Angular Foundation',
            value: 'foundation'
          }
        ];

        if (answers.ngversion === '1.2.*') {
          choices.splice(2, 0, {
            name: 'Bootstrap with UI Bootstrap',
            value: 'uibootstrap'
          });
        } else {
          choices.splice(1, 0, {
            name: 'Angular Material',
            value: 'material'
          });
        }

        return choices;
      }

    },
    {
      type: 'confirm',
      name: 'ngRoute',
      message: 'Should ngRoute be used instead of UI Router?',
      default: false
    },
    {
      type: 'checkbox',
      name: 'bower',
      message: 'Which additional Bower components should be installed?',
      choices: function (answers) {
        var choices = [
          {
            name: 'Angular Animate',
            value: 'animate'
          },
          {
            name: 'Angular Cookies',
            value: 'cookies'
          },
          {
            name: 'Angular Resource',
            value: 'resource'
          },
          {
            name: 'Angular Sanitize',
            value: 'sanitize'
          },
          {
            name: 'Angular Touch',
            value: 'touch'
          },
          {
            name: 'Font Awesome',
            value: 'fontawesome'
          },
          {
            name: 'Lo-Dash',
            value: 'lodash'
          },
          {
            name: 'Restangular (installs Lo-Dash)',
            value: 'restangular'
          }
        ];

        if (answers.ngversion === '1.3.*') {
          choices.splice(1, 0, {
            name: 'Angular Aria',
            value: 'aria'
          });
          choices.splice(3, 0, {
            name: 'Angular Messages',
            value: 'messages'
          });
        }

        return choices;
      }
    }
  ], function (props) {
    // needs to be a string
    props.bower = props.bower.join(',');
    // question asks if controllers should be created, but
    // we want to know if controllers should be skipped
    // should rename to create controller in future
    props.skipController = !props.skipController;

    // attach answers to `this`
    _.merge(this, props);

    done();
  }.bind(this));
};

Generator.prototype.configuring = function configuring() {
  // create a directory named `appName`
  this.destinationRoot(this.appName);

  // save config info
  this.config.set('structure', this.structure);
  this.config.set('markup', this.markup);
  this.config.set('appScript', this.appScript);
  this.config.set('controllerAs', this.controllerAs);
  this.config.set('skipController', this.skipController);
  this.config.set('testScript', this.testScript);
  this.config.set('testFramework', this.testFramework);
  this.config.set('e2eTestFramework', this.e2eTestFramework);
  this.config.set('style', this.style);
  this.config.set('ngRoute', this.ngRoute);
  this.config.set('lastUsedModule', 'home');

  this.context = {
    appName: this.appName,
    structure: this.structure,
    ngversion: this.ngversion,
    appDir: this.appDir,
    unitTestDir: this.unitTestDir,
    host: this.host,
    port: this.port,
    moduleName: utils.lowerCamel(this.appName),
    polymer: this.polymer,
    framework: this.framework,
    testFramework: this.testFramework,
    e2eTestFramework: this.e2eTestFramework,
    ngRoute: this.ngRoute,
    bower: this.bower
  };

  // copy over common project files
  this.copySimpleFile('.bowerrc');
  this.copySimpleFile('.editorconfig');
  this.copySimpleFile('.eslintrc');
  this.copySimpleFile('.jscsrc');
  this.copySimpleFile('.jshintrc');
  this.copySimpleFile('_bower.json');
  this.copySimpleFile('_build.config.js');
  this.copySimpleFile('_gulpfile.js', 'Gulpfile.js');
  this.copySimpleFile('_karma.config.js');
  this.copySimpleFile('_package.json');
  if (this.appScript === 'ts') {
    this.copySimpleFile('_tsd.json');
  }
  this.copySimpleFile('gitignore', '.gitignore');
  this.copySimpleFile('_protractor.config.js');
  this.copySimpleFile('_readme.md', 'README.md');

  // copy over gulp files
  this.copySimpleFile('gulp/analyze.js');
  this.copySimpleFile('gulp/_build.js');
  this.copySimpleFile('gulp/_test.js');
  this.copySimpleFile('gulp/watch.js');
};

Generator.prototype.writing = function writing() {
  // create main module and index.html
  this.copySimpleFile('_app.' + this.appScript, path.join(this.appDir, 'app.' + this.appScript));
  this.copySimpleFile('_index.' + this.markup, path.join(this.appDir, 'index.' + this.markup));

  mkdirp.sync(path.join(this.appDir, 'fonts'));
  mkdirp.sync(path.join(this.appDir, 'images'));
};

Generator.prototype.install = function install() {
  if (!this.options['skip-install']) {
    this.installDependencies();
    if (this.appScript === 'ts') {
      this.log('Running ' + chalk.yellow.bold('tsd reinstall && tsd rebundle') + '. If this fails run the commands ' +
        'yourself. Tsd must be installed via `npm install -g tsd@next`.');
      this.spawnCommand('tsd reinstall && tsd rebundle');
    }
  }
};

Generator.prototype.end = function end() {
  this.composeWith('ng-poly:module', {
    args: ['home'],
    options: {
      module: 'home',
      markup: this.markup,
      style: this.style,
      'test-dir': this.testDir,
      'test-script': this.testScript,
      'controller-as': this.controllerAs,
      'skip-controller': this.skipController,
      'ng-route': this.ngRoute
    }
  }, {
    local: require.resolve('../module'),
    link: 'strong'
  });
};
