'use strict';
import 'babel-polyfill';
import genBase from '../genBase';

module.exports = genBase.extend({
  prompting() {
    return this.askForModuleName();
  },

  async writing() {
    const done = this.async();

    await Promise.all([
      this.copySrcFile('constant'),
      this.copyUnitTest('constant')
    ]);

    done();
  }
});
