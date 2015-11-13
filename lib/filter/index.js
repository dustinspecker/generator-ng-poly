'use strict';
import GenBase from '../genBase';

module.exports = class Generator extends GenBase {
  constructor(...args) {
    super(...args);
  }

  get prompting() {
    return function () {
      this.askForModuleName();
    };
  }

  get writing() {
    return async function () {
      const done = this.async();

      await Promise.all([
        this.copySrcFile('filter'),
        this.copyUnitTest('filter')
      ]);

      done();
    };
  }
};
