'use strict';
import 'babel-polyfill';
import genBase from '../genBase';

module.exports = genBase.extend({
  prompting() {
    this.askForModuleName();
  },

  async writing() {
    const done = this.async();

    await Promise.all([
      this.copySrcFile('service'),
      this.copyUnitTest('service')
    ]);

    done();
  }
});
