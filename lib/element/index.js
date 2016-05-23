'use strict';
import 'babel-polyfill';
import genBase from '../genBase';
import mkdirp from 'mkdirp';
import path from 'path';
import pify from 'pify';

module.exports = genBase.extend({
  async writing() {
    const config = await this.getConfig()
      , elementDir = path.join(config.appDir, 'components', config.hyphenName);

    await pify(mkdirp)(elementDir);

    if (config.appScript === 'ts') {
      config.referencePath = path.relative(elementDir, config.appDir);
      config.appScript = 'js';
    }

    return Promise.all([
      this.copyStyleFile('element', path.join(elementDir, config.hyphenName + '.' + config.style), config),
      this.copyMarkupFile('element', path.join(elementDir, config.hyphenName + '.' + config.markup), config),
      this.copySrcFile('element', path.join(elementDir, config.hyphenName + '.' + config.appScript), config)
    ]);
  }
});
