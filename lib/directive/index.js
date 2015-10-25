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
    return async function () {
      const done = this.async();

      let config = await this.getConfig();

      config.templateUrl = config.modulePath;

      if (config.structure === 'module-type') {
        config.templateUrl = path.join(config.modulePath, 'directives');
      }
      config.templateUrl = config.templateUrl.replace(/\\/g, '/');

      if (config.directiveTemplateUrl) {
        await this.copyMarkupFile('directive', config);
      }

      await Promise.all([
        this.copySrcFile('directive', config),
        this.copyUnitTest('directive', config)
      ]);

      done();
    };
  }
}
