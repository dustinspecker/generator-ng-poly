'use strict';

/**
 * Returns supported Angular versions
 * @return {Object[]} - list of supported Angular versions with name and value
 */
exports.getAngularVersions = function () {
  return ['1.4.*', '1.3.*', '1.2.*'].map(version => ({name: version, value: version}));
};

/**
 * Returns available Bower component choices for a given Angular version
 * @param {String} [angularVersion=1.2.*] - version of Angular being used in the format of '1.X.*'
 * @return {Object[]} - list of bower components with a name and value property
 */
exports.getBowerComponents = function (angularVersion = '1.2.*') {
  let bowerComponents;

  bowerComponents = [
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

  if (angularVersion !== '1.2.*') {
    bowerComponents.splice(1, 0, {
      name: 'Angular Aria',
      value: 'aria'
    });
    bowerComponents.splice(3, 0, {
      name: 'Angular Messages',
      value: 'messages'
    });
  }

  return bowerComponents;
};

/**
 * Returns supported markup languages
 * @return {Object[]} - list of markup languages with name and value properties
 */
exports.getMarkupLanguages = function () {
  return [
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
  ];
};

/**
 * Returns supported module structures
 * @return {Object[]} - list of module structures with name and value properties
 */
exports.getModuleStructures = function () {
  return [
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
  ];
};

/**
 * Returns supported script languages
 * @return {Object[]} - list of script languages with name and value properties
 */
exports.getScriptLanguages = function () {
  return [
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
  ];
};

/**
 * Returns supported style langauges
 * @return {Object[]} - list of style languages with a name and value property
 */
exports.getStyleLanguages = function () {
  return [
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
  ];
};

/**
 * Returns supported test frameworks
 * @return {Object[]} - list of test frameworks with a name and value property
 */
exports.getTestFrameworks = function () {
  return [
    {
      name: 'Jasmine',
      value: 'jasmine'
    },
    {
      name: 'Mocha with Chai',
      value: 'mocha'
    }
  ];
};

/**
 * Returns available frameworks for a given Angular version
 * @param {String} [angularVersion=1.2.*] - version of Angular being used in the format of '1.X.*'
 * @return {Object[]} - list of frameworks with a name and value property
 */
exports.getUIFrameworks = function (angularVersion = '1.2.*') {
  let frameworks;

  frameworks = [
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
  ];

  if (angularVersion !== '1.2.*') {
    frameworks.splice(1, 0, {
      name: 'Angular Material',
      value: 'material'
    });
  }

  return frameworks;
};
