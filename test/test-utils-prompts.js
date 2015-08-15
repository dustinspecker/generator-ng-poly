/* global describe, it */
'use strict';
import {expect} from 'chai';
import promptsUtils from '../generators/utils/prompts';

describe('Prompt Utils', () => {
  describe('getUIFrameworks', () => {
    const frameworksForAllVersions = [
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
