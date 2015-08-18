'use strict';
import _ from 'lodash';
import chalk from 'chalk';
import GenBase from '../genBase';
import mkdirp from 'mkdirp';
import path from 'path';
import pkg from '../../package.json';
import utils from '../utils';
import yosay from 'yosay';

export default class Generator extends GenBase {
  constructor(...args) {
    super(...args);
  }

  get initializing() {
    return function () {
      this.host = this.options.host || 'localhost';
      this.port = this.options.port || 3000;
      this.appDir = this.options['app-dir'] || 'app';
      this.unitTestDir = this.options['unit-test-dir'] || 'app';
      this.skipController = this.options['skip-controller'] || false;

      console.log(chalk.yellow(`Using host: ${this.host}`));
      console.log(chalk.yellow(`Using port: ${this.port}`));
      console.log(chalk.yellow(`Using app directory: ${this.appDir}`));
      console.log(chalk.yellow(`Using unit test directory: ${this.unitTestDir}`));
      console.log(chalk.yellow(
        `Route generator will ${(this.skipController ? chalk.red('NOT ') : '')}create controllers`));
    };
  }

  get prompting() {
    return function () {
      const done = this.async();

      this.log(yosay('Welcome to ngPoly!'));

      // ask for app name
      // get preferred langugaes
      this.prompt([
        {
          name: 'appName',
          message: 'What is the app\'s name?',
          validate: input => !!input
        },
        {
          type: 'list',
          name: 'ngversion',
          message: 'Which version of Angular should be used?',
          default: '1.4.*',
          choices: utils.getAngularVersions()
        },
        {
          type: 'list',
          name: 'structure',
          message: 'Which structure should be used?',
          default: 'module-only',
          choices: utils.getModuleStructures()
        },
        {
          type: 'list',
          name: 'markup',
          message: 'Which is the preferred markup language?',
          default: 'jade',
          choices: utils.getMarkupLanguages()
        },
        {
          type: 'list',
          name: 'appScript',
          message: 'Which is the preferred application scripting language?',
          default: 'js',
          choices: utils.getScriptLanguages()
        },
        {
          type: 'confirm',
          name: 'controllerAs',
          message: 'Want to use Controller As syntax?',
          default: true
        },
        {
          type: 'confirm',
          name: 'directiveTemplateUrl',
          message: 'Should directives be generated using a templateUrl (and markup file) instead of an inline template?',
          default: true
        },
        {
          type: 'list',
          name: 'testScript',
          message: 'Which is the preferred test scripting language?',
          default: answers => answers.appScript,
          choices: utils.getScriptLanguages()
        },
        {
          type: 'list',
          name: 'testFramework',
          message: 'Which is the preferred unit testing framework?',
          default: 'jasmine',
          choices: utils.getTestFrameworks()
        },
        {
          type: 'list',
          name: 'e2eTestFramework',
          message: 'Which is the preferred e2e testing framework?',
          default: answers => answers.testFramework,
          choices: utils.getTestFrameworks()
        },
        {
          type: 'list',
          name: 'style',
          message: 'Which is the preferred style language?',
          default: 'less',
          choices: utils.getStyleLanguages()
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
          choices: answers => utils.getUIFrameworks(answers.ngversion)
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
          choices: answers => utils.getBowerComponents(answers.ngversion)
        }
      ], props => {
        // needs to be a string
        props.bower = props.bower.join(',');

        // attach answers to `this`
        _.merge(this, props);

        done();
      });
    };
  }

  get configuring() {
    return function () {
      // create a directory named `appName`
      this.destinationRoot(this.appName);

      // save config
      ['appScript',
        'controllerAs',
        'directiveTemplateUrl',
        'e2eTestFramework',
        'markup',
        'ngRoute',
        'structure',
        'style',
        'testFramework',
        'testScript'
      ].forEach(option => this.config.set(option, this[option]));

      this.context = {
        pkg,
        appName: this.appName,
        structure: this.structure,
        ngversion: this.ngversion,
        appDir: this.appDir,
        appScript: this.appScript,
        testScript: this.testScript,
        markup: this.markup,
        style: this.style,
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
      ['.bowerrc',
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
      ].forEach(file => this.copySimpleFile(file));

      // files that need to be renamed when copied
      this.copySimpleFile('_gulpfile.js', 'Gulpfile.js');
      this.copySimpleFile('gitignore', '.gitignore');
      this.copySimpleFile('_readme.md', 'README.md');

      if (this.appScript === 'ts') {
        this.copySimpleFile('_tsd.json');
      }
    };
  }

  get writing() {
    return function () {
      // create main module and index.html
      this.copySimpleFile(`_app.${this.appScript}`, path.join(this.appDir, `app-module.${this.appScript}`));
      this.copySimpleFile(`_app-routes.${this.appScript}`, path.join(this.appDir, `app-routes.${this.appScript}`));
      this.copySimpleFile(`_index.${this.markup}`, path.join(this.appDir, `index.${this.markup}`));

      mkdirp.sync(path.join(this.appDir, 'fonts'));
      mkdirp.sync(path.join(this.appDir, 'images'));
    };
  }

  get install() {
    return function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
        if (this.appScript === 'ts') {
          this.log(`Running ${chalk.yellow.bold('tsd reinstall --save')}. If this fails run the commands ` +
            'yourself. TSD must be installed via `npm install -g tsd`.');
          this.spawnCommand('tsd', ['reinstall', '--save']);
        }
      }
    };
  }

  get end() {
    return function () {
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
  }
}
