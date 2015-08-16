'use strict';

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
