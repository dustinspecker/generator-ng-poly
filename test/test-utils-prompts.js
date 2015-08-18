/* global describe, it */
'use strict';
import {expect} from 'chai';
import promptsUtils from '../generators/utils/prompts';

describe('Prompt Utils', () => {
  describe('getAngularVersions', () => {
    it('should return supported Angular versions', () => {
      let expectedVersions;

      expectedVersions = [
        {
          name: '1.4.*',
          value: '1.4.*'
        },
        {
          name: '1.3.*',
          value: '1.3.*'
        },
        {
          name: '1.2.*',
          value: '1.2.*'
        }
      ];

      expect(promptsUtils.getAngularVersions()).to.eql(expectedVersions);
    });
  });

  describe('getBowerComponents', () => {
    let bowerComponentsForAllVersions;

    bowerComponentsForAllVersions = [
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

    it('should return components avilable for any Angular version', () => {
      expect(promptsUtils.getBowerComponents()).to.eql(bowerComponentsForAllVersions);
    });

    describe('Angular ^1.3.* copmonents', () => {
      let angularAria, angularMessages;

      angularAria = {
        name: 'Angular Aria',
        value: 'aria'
      };

      angularMessages = {
        name: 'Angular Messages',
        value: 'messages'
      };

      it('should not return Angular Aria and Messages for 1.2.*', () => {
        expect(promptsUtils.getBowerComponents()).to.eql(bowerComponentsForAllVersions);
      });

      it('should return Angular Aria and Messages for 1.3.*', () => {
        const bowerComponentsFor13 = promptsUtils.getBowerComponents('1.3.*');
        expect(bowerComponentsFor13[1]).to.eql(angularAria);
        expect(bowerComponentsFor13[3]).to.eql(angularMessages);
        expect(bowerComponentsFor13.length).to.eql(10);
      });

      it('should return Angular Aria and Messages for 1.4.*', () => {
        const bowerComponentsFor14 = promptsUtils.getBowerComponents('1.4.*');
        expect(bowerComponentsFor14[1]).to.eql(angularAria);
        expect(bowerComponentsFor14[3]).to.eql(angularMessages);
        expect(bowerComponentsFor14.length).to.eql(10);
      });
    });
  });

  describe('getMarkupLanguages', () => {
    it('should return supported markup languages', () => {
      let expectedMarkupLanguages;

      expectedMarkupLanguages = [
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

      expect(promptsUtils.getMarkupLanguages()).to.eql(expectedMarkupLanguages);
    });
  });

  describe('getModuleStructures', () => {
    it('should return supported module structures', () => {
      let expectedModuleStructures;

      expectedModuleStructures = [
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

      expect(promptsUtils.getModuleStructures()).to.eql(expectedModuleStructures);
    });
  });

  describe('getScriptLanguages', () => {
    it('should return supported script languages', () => {
      let expectedScriptLanguages;

      expectedScriptLanguages = [
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

      expect(promptsUtils.getScriptLanguages()).to.eql(expectedScriptLanguages);
    });
  });

  describe('getStyleLanguages', () => {
    it('should return supported style languages', () => {
      let expectedStyleLanguages;

      expectedStyleLanguages = [
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

      expect(promptsUtils.getStyleLanguages()).to.eql(expectedStyleLanguages);
    });
  });

  describe('getTestFrameworks', () => {
    it('should return supported testing frameworks', () => {
      let expectedTestFrameworks;

      expectedTestFrameworks = [
        {
          name: 'Jasmine',
          value: 'jasmine'
        },
        {
          name: 'Mocha with Chai',
          value: 'mocha'
        }
      ];

      expect(promptsUtils.getTestFrameworks()).to.eql(expectedTestFrameworks);
    });
  });

  describe('getUIFrameworks', () => {
    let frameworksForAllVersions;

    frameworksForAllVersions = [
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

    it('should return frameworks available for any Angular version', () => {
      expect(promptsUtils.getUIFrameworks()).to.eql(frameworksForAllVersions);
    });

    describe('Angular Material', () => {
      const angularMaterial = {
        name: 'Angular Material',
        value: 'material'
      };

      it('should not return Angular Material for version 1.2.*.', () => {
        expect(promptsUtils.getUIFrameworks('1.2.*')).to.eql(frameworksForAllVersions);
      });

      it('should also return Angular Material for version 1.3.*', () => {
        const frameworksFor13 = promptsUtils.getUIFrameworks('1.3.*');
        expect(frameworksFor13[1]).to.eql(angularMaterial);
        expect(frameworksFor13.length).to.eql(5);
      });

      it('should also return Angular Material for version 1.4.*', () => {
        const frameworksFor14 = promptsUtils.getUIFrameworks('1.4.*');
        expect(frameworksFor14[1]).to.eql(angularMaterial);
        expect(frameworksFor14.length).to.eql(5);
      });
    });
  });
});
