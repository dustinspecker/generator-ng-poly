'use strict';
import GenBase from '../genBase';

export default class Generator extends GenBase {
  constructor(...args) {
    super(...args);
  }

  get prompting() {
    return function () {
      this.askForModuleName();
    };
  }

  get writing() {
    return function () {
      this.copySrcFile('provider');
      this.copyUnitTest('provider');
    };
  }
}
