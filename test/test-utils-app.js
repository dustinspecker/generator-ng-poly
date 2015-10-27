/* global describe, beforeEach, it */
'use strict';
import {expect} from 'chai';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('App Utils', () => {
  let fsStub, getYoRcPathStub, moduleUtilsStub, utilsProxy;

  beforeEach(() => {
    getYoRcPathStub = {
      dir: sinon.stub().returns(Promise.resolve('awesome-project'))
    };

    fsStub = {
      readFile(fileName, cb) {
        cb(null, 'angular.module(\'awesomeName\', [])');
      }
    };

    moduleUtilsStub = {
      findModuleFile: sinon.stub().returns(Promise.resolve('app-module.js'))
    };

    utilsProxy = proxyquire('../generators/utils/app', {
      './module': moduleUtilsStub,
      'get-yo-rc-path': getYoRcPathStub,
      fs: fsStub
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

      expectRequire('awesome-project/build.config.js').return({appDir: 'app'});
      appName = await utilsProxy.getAppName();
      expect(appName).to.eql('awesomeName');
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
});
