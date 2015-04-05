'use strict';
var _ = require('lodash')
  , chalk = require('chalk')
  , genBase = require('../genBase')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , pkg = require('../package.json')
  , utils = require('../utils')
  , yosay = require('yosay')
  , Generator;

Generator = module.exports = genBase.extend();

Generator.prototype.initializing = function initializing() {
  this.host = this.options.host || 'localhost';
  this.port = this.options.port || 3000;
  this.appDir = this.options['app-dir'] || 'app';
  this.unitTestDir = this.options['unit-test-dir'] || 'app';
  this.skipController = this.options['skip-controller'] || false;

  console.log(chalk.yellow('Using host: ' + this.host));
  console.log(chalk.yellow('Using port: ' + this.port));
  console.log(chalk.yellow('Using app directory: ' + this.appDir));
  console.log(chalk.yellow('Using unit test directory: ' + this.unitTestDir));
  console.log(chalk.yellow('Route generator will ' +
    (this.skipController ? chalk.red('NOT ') : '') + 'create controllers'));
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
                '│   ├── module1-module.js',
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
                '│   └── module1-module.js',
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

    // attach answers to `this`
    _.merge(this, props);

    done();
  }.bind(this));
};

Generator.prototype.configuring = function configuring() {
  // create a directory named `appName`
  this.destinationRoot(this.appName);

  // save config
  [
    'appScript',
    'controllerAs',
    'e2eTestFramework',
    'markup',
    'ngRoute',
    'structure',
    'style',
    'testFramework',
    'testScript'
  ].forEach(function (option) {
    this.config.set(option, this[option]);
  }.bind(this));

  this.context = {
    pkg: pkg,
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
  [
    '.bowerrc',
    '.editorconfig',
    '.eslintrc',
    '.jscsrc',
    '.jshintrc',
    '_bower.json',
    '_build.config.js',
    '_karma.config.js',
    '_package.json',
    '_protractor.config.js',
    'gulp/analyze.js',
    'gulp/_build.js',
    'gulp/_test.js',
    'gulp/watch.js'
  ].forEach(function (file) {
    this.copySimpleFile(file);
  }.bind(this));

  // files that need to be renamed when copied
  this.copySimpleFile('_gulpfile.js', 'Gulpfile.js');
  this.copySimpleFile('gitignore', '.gitignore');
  this.copySimpleFile('_readme.md', 'README.md');

  if (this.appScript === 'ts') {
    this.copySimpleFile('_tsd.json');
  }
};

Generator.prototype.writing = function writing() {
  // create main module and index.html
  this.copySimpleFile('_app.' + this.appScript, path.join(this.appDir, 'app-module.' + this.appScript));
  this.copySimpleFile('_app-routes.' + this.appScript, path.join(this.appDir, 'app-routes.' + this.appScript));
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
