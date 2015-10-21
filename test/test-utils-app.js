/* global describe, beforeEach, it */
'use strict';
import {expect} from 'chai';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('App Utils', () => {
  let findUpStub, utilsProxy;

  beforeEach(() => {
    findUpStub = {
      sync: sinon.stub().returns('awesome-project/.yo-rc.json')
    };

    utilsProxy = proxyquire('../generators/utils/app', {
      'find-up': findUpStub
    });
  });

  describe('getAppDir', () => {
    it('should return app dir', () => {
      expectRequire('awesome-project/build.config.js').return({appDir: 'app'});
      return utilsProxy.getAppDir().then(appDir => {
        expect(appDir).to.eql('app');
      });
    });
  });

  describe('getAppName', () => {
    it('should return app name', () => {
      expectRequire('awesome-project/package.json').return({name: 'awesomeProject'});
      return utilsProxy.getAppName().then(appName => {
        expect(appName).to.eql('awesomeProject');
      });
    });
  });

  describe('getFileFromRoot', () => {
    it('should return file JS/JSON', () => {
      expectRequire('awesome-project/file.js').return('file-contents');
      return utilsProxy.getFileFromRoot('file.js').then(contents => {
        expect(contents).to.eql('file-contents');
      });
    });
  });

  describe('getUnitTestDir', () => {
    it('should return unit test dir', () => {
      expectRequire('awesome-project/build.config.js').return({unitTestDir: 'test'});
      return utilsProxy.getUnitTestDir().then(testDir => {
        expect(testDir).to.eql('test');
      });
    });
  });

  describe('getYoPath', () => {
    it('should return dirname of yopath', () => {
      return utilsProxy.getYoPath().then(yoPath => {
        expect(yoPath).to.eql('awesome-project');
        expect(findUpStub.sync.calledWith('.yo-rc.json')).to.eql(true);
      });
    });
  });
});
