'use strict';
import genBase from '../genBase';

module.exports = genBase.extend({
  prompting() {
    this.askForModuleName();
  },

  async writing() {
    const done = this.async();

    await Promise.all([
      this.copySrcFile('factory'),
      this.copyUnitTest('factory')
    ]);

    done();
  }
});
