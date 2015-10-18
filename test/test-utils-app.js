/* global describe, beforeEach, afterEach, it */
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

    sinon.spy(path, 'join');
  });

  afterEach(() => {
    path.join.restore();
  });

  describe('getAppDir', () => {
    it('should return app dir', () => {
      expectRequire('awesome-project/build.config.js').return({appDir: 'app'});

      expect(utilsProxy.getAppDir()).to.eql('app');
      expect(moduleUtilsStub.getYoPath.calledOnce).to.eql(true);
      expect(path.join.calledWith('awesome-project', 'build.config.js')).to.eql(true);
    });
  });

  describe('getAppName', () => {
    it('should return app name', () => {
      expectRequire('awesome-project/package.json').return({name: 'awesomeProject'});

      expect(utilsProxy.getAppName()).to.eql('awesomeProject');
      expect(moduleUtilsStub.getYoPath.calledOnce).to.eql(true);
      expect(path.join.calledWith('awesome-project', 'package.json')).to.eql(true);
    });
  });

  describe('getUnitTestDir', () => {
    it('should return unit test dir', () => {
      expectRequire('awesome-project/build.config.js').return({unitTestDir: 'test'});

      expect(utilsProxy.getUnitTestDir()).to.eql('test');
      expect(moduleUtilsStub.getYoPath.calledOnce).to.eql(true);
      expect(path.join.calledWith('awesome-project', 'build.config.js')).to.eql(true);
    });
  });
});
