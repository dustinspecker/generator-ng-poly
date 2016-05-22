'use strict';
import 'babel-polyfill';
import genBase from '../genBase';
import path from 'path';

module.exports = genBase.extend({
  prompting() {
    return this.askForModuleName();
  },

  async writing() {
    const done = this.async()
      , config = await this.getConfig();

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
  }
});
