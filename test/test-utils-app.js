/* global describe, beforeEach, it */
'use strict';
import {expect} from 'chai';
import {expectRequire} from 'a';
import path from 'path';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('App Utils', () => {
  let moduleUtilsStub, utilsProxy;

  beforeEach(() => {
    moduleUtilsStub = {
      getYoPath: sinon.stub().returns('awesome-project')
    };

    // mock out path to avoid needing to use file system to find build.config.json
    utilsProxy = proxyquire('../generators/utils/app', {
      './module': moduleUtilsStub
    });
  });

  describe('getAppDir', () => {
    it('should return app dir', () => {
      expectRequire('awesome-project/build.config.js').return({appDir: 'app'});

      expect(utilsProxy.getAppDir()).to.eql('app');
    });
  });

  describe('getAppName', () => {
    it('should return app name', () => {
      expectRequire('awesome-project/package.json').return({name: 'awesomeProject'});

      expect(utilsProxy.getAppName()).to.eql('awesomeProject');
    });
  });

  describe('getFileFromRoot', () => {
    it('should return file JS/JSON', () => {
      sinon.spy(path, 'join');

      expectRequire('awesome-project/file.js').return('file-contents');

      expect(utilsProxy.getFileFromRoot('file.js')).to.eql('file-contents');
      expect(moduleUtilsStub.getYoPath.calledOnce).to.eql(true);
      expect(path.join.calledWith('awesome-project', 'file.js')).to.eql(true);

      path.join.restore();
    });
  });

  describe('getUnitTestDir', () => {
    it('should return unit test dir', () => {
      expectRequire('awesome-project/build.config.js').return({unitTestDir: 'test'});

      expect(utilsProxy.getUnitTestDir()).to.eql('test');
    });
  });
});
