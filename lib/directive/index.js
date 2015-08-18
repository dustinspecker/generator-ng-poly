'use strict';
import GenBase from '../genBase';
import path from 'path';

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
      const config = this.getConfig();

      config.templateUrl = config.modulePath;

      if (config.structure === 'module-type') {
        config.templateUrl = path.join(config.modulePath, 'directives');
      }
      config.templateUrl = config.templateUrl.replace(/\\/g, '/');

      if (config.directiveTemplateUrl) {
        this.copyMarkupFile('directive', config);
      }
      this.copySrcFile('directive', config);
      this.copyUnitTest('directive', config);
    };
  }
}
