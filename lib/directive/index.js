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
      const done = this.async();

      let config;

      this.getConfig().then(requestedConfig => {
        config = requestedConfig;

        config.templateUrl = config.modulePath;

        if (config.structure === 'module-type') {
          config.templateUrl = path.join(config.modulePath, 'directives');
        }
        config.templateUrl = config.templateUrl.replace(/\\/g, '/');

        if (config.directiveTemplateUrl) {
          return this.copyMarkupFile('directive', config);
        }
      }).then(() => {
        return Promise.all([
          this.copySrcFile('directive', config),
          this.copyUnitTest('directive', config)
        ]);
      }).then(() => {
        done();
      });
    };
  }
}
