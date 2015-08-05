/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('View generator', () => {
  before(done => {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withPrompts({
        appName: 'temp-view',
        markup: 'html',
        appScript: 'js',
        controllerAs: false,
        testScript: 'js',
        testDir: 'app',
        style: 'less',
        bower: []
      })
      .withGenerators([
        join(__dirname, '../generators/module'),
        join(__dirname, '../generators/route'),
        join(__dirname, '../generators/controller'),
        join(__dirname, '../generators/view')
      ])
      .on('end', done);
  });

  describe('with HTML markup and LESS style with module-type', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/view'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create view files', () => {
      assert.file([
        'app/home/views/test.tpl.html',
        'app/home/views/test.less'
      ]);
    });

    it('should have correct template contents', () => {
      assert.fileContent('app/home/views/test.tpl.html', /<h2>test<\/h2>[^$]*<p>{{test.ctrlName}}<\/p>/);
    });
  });

  describe('with HAML markup and CSS style', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/view'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          markup: 'haml',
          style: 'css'
        })
        .on('end', done);
    });

    it('should create view files', () => {
      assert.file([
        'app/home/test1.tpl.haml',
        'app/home/test1.css'
      ]);
    });

    it('should have correct template contents', () => {
      assert.fileContent('app/home/test1.tpl.haml', /%h2 test1[^$]*%p {{test1.ctrlName}}/);
    });
  });

  describe('with Jade markup and SCSS style', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/view'), {
          tmpdir: false
        })
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          style: 'scss'
        })
        .on('end', done);
    });

    it('should create view files', () => {
      assert.file([
        'app/home/test2.tpl.jade',
        'app/home/test2.scss'
      ]);
    });

    it('should have correct template contents', () => {
      assert.fileContent('app/home/test2.tpl.jade', /h2 test2[^$]*p {{test2.ctrlName}}/);
    });
  });

  describe('with Jade markup and Stylus style', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/view'), {
          tmpdir: false
        })
        .withArguments(['test3'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          style: 'styl'
        })
        .on('end', done);
    });

    it('should create view files', () => {
      assert.file([
        'app/home/test3.tpl.jade',
        'app/home/test3.styl'
      ]);
    });
  });
});
