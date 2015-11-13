'use strict';
import genBase from '../genBase';

module.exports = genBase.extend({
  prompting() {
    this.askForModuleName();
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
