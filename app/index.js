'use strict';
var chalk = require('chalk')
  , path = require('path')
  , utils = require('../utils')
  , yeoman = require('yeoman-generator')
  , yosay = require('yosay')
  , Generator;

Generator = module.exports = yeoman.generators.Base.extend();

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
      name: 'host',
      message: 'What host should the app run on?',
      default: 'localhost'
    },
    {
      name: 'port',
      message: 'Which port should the app run on?',
      default: 3000
    },
    {
      name: 'appDir',
      message: 'Which folder should the app be developed in?',
      default: 'app'
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
          name: 'JavaScript',
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
      type: 'confirm',
      name: 'passFunc',
      message: 'Should functions be defined and passed instead of defined inline (in callbacks)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'namedFunc',
      message: 'Want to use named functions instead of anonymous?',
      default: true
    },
    {
      name: 'unitTestDir',
      message: 'Where should unit tests be saved?',
      default: 'app'
    },
    {
      type: 'list',
      name: 'testScript',
      message: 'Which is the preferred test scripting language?',
      default: 'js',
      choices: [
        {
          name: 'CoffeeScript',
          value: 'coffee'
        },
        {
          name: 'JavaScript',
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
      choices: [
        {
          name: 'none',
          value: 'none'
        },
        {
          name: 'Bootstrap with AngularStrap',
          value: 'angularstrap'
        },
        {
          name: 'Bootstrap with UI Bootstrap',
          value: 'uibootstrap'
        },
        {
          name: 'Foundation with Angular Foundation',
          value: 'foundation'
        }
      ]
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
    this.appName = props.appName;
    this.ngversion = props.ngversion;
    this.appDir = props.appDir;
    this.host = props.host;
    this.port = props.port;
    this.markup = props.markup;
    this.appScript = props.appScript;
    this.controllerAs = props.controllerAs;
    this.skipController = !props.skipController;
    this.passFunc = props.passFunc;
    this.namedFunc = props.namedFunc;
    this.testScript = props.testScript;
    this.testFramework = props.testFramework;
    this.e2eTestFramework = props.e2eTestFramework;
    this.unitTestDir = props.unitTestDir;
    this.style = props.style;
    this.polymer = props.polymer;
    this.ngRoute = props.ngRoute;
    this.framework = props.framework;
    this.bower = props.bower.join(',');

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
  this.config.set('skipController', this.skipController);
  this.config.set('passFunc', this.passFunc);
  this.config.set('namedFunc', this.namedFunc);
  this.config.set('testScript', this.testScript);
  this.config.set('testFramework', this.testFramework);
  this.config.set('e2eTestFramework', this.e2eTestFramework);
  this.config.set('style', this.style);
  this.config.set('ngRoute', this.ngRoute);
  this.config.set('lastUsedModule', 'home');

  this.context = {
    appName: this.appName,
    ngversion: this.ngversion,
    appDir: this.appDir,
    unitTestDir: this.unitTestDir,
    host: this.host,
    port: this.port,
    moduleName: utils.lowerCamel(this.appName),
    passFunc: this.passFunc,
    namedFunc: this.namedFunc,
    polymer: this.polymer,
    framework: this.framework,
    testFramework: this.testFramework,
    e2eTestFramework: this.e2eTestFramework,
    ngRoute: this.ngRoute,
    bower: this.bower
  };

  // copy over common project files
  this.fs.copy(
    this.templatePath('.bowerrc'),
    this.destinationPath('.bowerrc')
  );
  this.fs.copy(
    this.templatePath('.editorconfig'),
    this.destinationPath('.editorconfig')
  );
  this.fs.copy(
    this.templatePath('.jscsrc'),
    this.destinationPath('.jscsrc')
  );
  this.fs.copy(
    this.templatePath('.jshintrc'),
    this.destinationPath('.jshintrc')
  );
  this.fs.copyTpl(
    this.templatePath('_bower.json'),
    this.destinationPath('bower.json'),
    this.context
  );
  this.fs.copyTpl(
    this.templatePath('_build.config.js'),
    this.destinationPath('build.config.js'),
    this.context
  );
  this.fs.copyTpl(
    this.templatePath('_gulpfile.js'),
    this.destinationPath('Gulpfile.js'),
    this.context
  );
  this.fs.copyTpl(
    this.templatePath('_karma.config.js'),
    this.destinationPath('karma.config.js'),
    this.context
  );
  this.fs.copyTpl(
    this.templatePath('_package.json'),
    this.destinationPath('package.json'),
    this.context
  );
  if (this.appScript === 'ts') {
    this.fs.copyTpl(
      this.templatePath('_tsd.json'),
      this.destinationPath('tsd.json'),
      this.context
    );
  }
  this.fs.copy(
    this.templatePath('gitignore'),
    this.destinationPath('.gitignore')
  );
  this.fs.copyTpl(
    this.templatePath('_protractor.config.js'),
    this.destinationPath('protractor.config.js'),
    this.context
  );
  this.fs.copyTpl(
    this.templatePath('_readme.md'),
    this.destinationPath('README.md'),
    this.context
  );

  // copy over gulp files
  this.mkdir('gulp');
  this.fs.copy(
    this.templatePath('analyze.js'),
    this.destinationPath('gulp/analyze.js')
  );
  this.fs.copyTpl(
    this.templatePath('_build.js'),
    this.destinationPath('gulp/build.js'),
    this.context
  );
  this.fs.copyTpl(
    this.templatePath('_test.js'),
    this.destinationPath('gulp/test.js'),
    this.context
  );
  this.fs.copy(
    this.templatePath('watch.js'),
    this.destinationPath('gulp/watch.js')
  );
};

Generator.prototype.writing = function writing() {
  this.mkdir(this.appDir);

  // create main module and index.html
  this.fs.copyTpl(
    this.templatePath('_app.' + this.appScript),
    this.destinationPath(this.appDir + '/app.' + this.appScript),
    this.context
  );
  this.fs.copyTpl(
    this.templatePath('_index.' + this.markup),
    this.destinationPath(this.appDir + '/index.' + this.markup),
    this.context
  );

  this.mkdir(path.join(this.appDir, 'fonts'));
  this.mkdir(path.join(this.appDir, 'images'));
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
      'pass-func': this.passFunc,
      'named-func': this.namedFunc,
      'ng-route': this.ngRoute
    }
  }, {
    local: require.resolve('../module'),
    link: 'strong'
  });
};
