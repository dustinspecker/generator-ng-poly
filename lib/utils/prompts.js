'use strict';

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
