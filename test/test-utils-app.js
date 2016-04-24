/* global describe, beforeEach, it */
'use strict';
import {expect} from 'chai';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';
import {join} from 'path';
import sinon from 'sinon';

describe('App Utils', () => {
  let getYoRcPathStub, utilsProxy;

  beforeEach(() => {
    getYoRcPathStub = {
      dir: sinon.stub().returns(Promise.resolve('awesome-project'))
    };

    utilsProxy = proxyquire('../generators/utils/app', {
      'get-yo-rc-path': getYoRcPathStub
    });
  });

  describe('getAppDir', () => {
    it('should return app dir', async () => {
      expectRequire(join('awesome-project', 'build.config.js')).return({appDir: 'app'});

      const appDir = await utilsProxy.getAppDir();
      expect(appDir).to.eql('app');
    });
  });

  describe('getFileFromRoot', () => {
    it('should return file JS/JSON', async () => {
      expectRequire(join('awesome-project', 'file.js')).return('file-contents');

      const fileContents = await utilsProxy.getFileFromRoot('file.js');
      expect(fileContents).to.eql('file-contents');
    });
  });

  describe('getUnitTestDir', () => {
    it('should return unit test dir', async () => {
      expectRequire(join('awesome-project', 'build.config.js')).return({unitTestDir: 'test'});

      const testDir = await utilsProxy.getUnitTestDir();
      expect(testDir).to.eql('test');
    });
  });
});
