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
    it('should return app dir', async () => {
      let appDir;

      expectRequire('awesome-project/build.config.js').return({appDir: 'app'});

      appDir = await utilsProxy.getAppDir();
      expect(appDir).to.eql('app');
    });
  });

  describe('getAppName', () => {
    it('should return app name', async () => {
      let appName;

      expectRequire('awesome-project/package.json').return({name: 'awesomeProject'});

      appName = await utilsProxy.getAppName();
      expect(appName).to.eql('awesomeProject');
    });
  });

  describe('getFileFromRoot', () => {
    it('should return file JS/JSON', async () => {
      let fileContents;

      expectRequire('awesome-project/file.js').return('file-contents');

      fileContents = await utilsProxy.getFileFromRoot('file.js');
      expect(fileContents).to.eql('file-contents');
    });
  });

  describe('getUnitTestDir', () => {
    it('should return unit test dir', async () => {
      let testDir;

      expectRequire('awesome-project/build.config.js').return({unitTestDir: 'test'});

      testDir = await utilsProxy.getUnitTestDir();
      expect(testDir).to.eql('test');
    });
  });

  describe('getYoPath', () => {
    it('should return dirname of yopath', async () => {
      let yoPath = await utilsProxy.getYoPath();

      expect(yoPath).to.eql('awesome-project');
      expect(findUpStub.sync.calledWith('.yo-rc.json')).to.eql(true);
    });
  });
});
