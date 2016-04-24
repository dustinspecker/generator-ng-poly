'use strict';

/**
 * Convert a list of strings to a list of objects with a name and value
 * @param {String[]} choices - list in the format of 'name:value' or 'name'
 * @return {Object[]} - choices with name and value properties
 */
const convertToNameValue = choices =>
  choices.map(choice => {
    const name = choice.split(':')[0]
      , value = choice.split(':')[1] || name.toLowerCase();

    return {name, value};
  });

module.exports = {
  /**
   * Returns supported Angular versions
   * @return {Object[]} - list of supported Angular versions with name and value
   */
  getAngularVersions() {
    return ['1.4.*', '1.3.*', '1.2.*'].map(version => ({name: version, value: version}));
  },

  /**
   * Returns available Bower component choices for a given Angular version
   * @param {String} [angularVersion=1.2.*] - version of Angular being used in the format of '1.X.*'
   * @return {Object[]} - list of bower components with a name and value property
   */
  getBowerComponents(angularVersion = '1.2.*') {
    const bowerComponents = [
      'Angular Animate:animate',
      'Angular Cookies:cookies',
      'Angular Resource:resource',
      'Angular Sanitize:sanitize',
      'Angular Touch:touch',
      'Font Awesome:fontawesome',
      'Lo-Dash:lodash',
      'Restangular (installs Lo-Dash):restangular'
    ];

    if (angularVersion !== '1.2.*') {
      bowerComponents.splice(1, 0, 'Angular Aria:aria');
      bowerComponents.splice(3, 0, 'Angular Messages:messages');
    }

    return convertToNameValue(bowerComponents);
  },

  /**
   * Returns supported markup languages
   * @return {Object[]} - list of markup languages with name and value properties
   */
  getMarkupLanguages() {
    return convertToNameValue(['HAML', 'HTML', 'Jade']);
  },

  /**
   * Returns supported module structures
   * @return {Object[]} - list of module structures with name and value properties
   */
  getModuleStructures() {
    return convertToNameValue([
      ['app/',
      '├── module1/',
      '│   ├── module2/',
      '│   ├── module1-module.js',
      '│   └── module1-controller.js',
      '└── app.js'].join('\n') + ':module-only',

      ['app/',
      '├── module1/',
      '│   ├── controllers/',
      '│   │   └── module1-controller.js',
      '│   ├── module2/',
      '│   └── module1-module.js',
      '└── app.js'].join('\n') + ':module-type'
    ]);
  },

  /**
   * Returns supported script languages
   * @return {Object[]} - list of script languages with name and value properties
   */
  getScriptLanguages() {
    return convertToNameValue([
      'CoffeeScript:coffee',
      'EcmaScript2015 (ES6) using Babel:es6',
      'JavaScript (ES5):js',
      'TypeScript:ts'
    ]);
  },

  /**
   * Returns supported style langauges
   * @return {Object[]} - list of style languages with a name and value property
   */
  getStyleLanguages() {
    return convertToNameValue(['CSS', 'LESS', 'SCSS', 'Stylus:styl']);
  },

  /**
   * Returns supported test frameworks
   * @return {Object[]} - list of test frameworks with a name and value property
   */
  getTestFrameworks() {
    return convertToNameValue(['Jasmine', 'Mocha with Chai:mocha']);
  },

  /**
   * Returns available frameworks for a given Angular version
   * @param {String} [angularVersion=1.2.*] - version of Angular being used in the format of '1.X.*'
   * @return {Object[]} - list of frameworks with a name and value property
   */
  getUIFrameworks(angularVersion = '1.2.*') {
    const frameworks = [
      'none',
      'Bootstrap with AngularStrap:angularstrap',
      'Bootstrap with UI Bootstrap:uibootstrap',
      'Foundation with Angular Foundation:foundation'
    ];

    if (angularVersion !== '1.2.*') {
      frameworks.splice(1, 0, 'Angular Material:material');
    }

    return convertToNameValue(frameworks);
  }
};
