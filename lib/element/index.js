'use strict';
import GenBase from '../genBase';
import mkdirp from 'mkdirp';
import path from 'path';
import pify from 'pify';

export default class Generator extends GenBase {
  constructor(...args) {
    super(...args);
  }

  get writing() {
    return async function () {
      const done = this.async();

      let config = await this.getConfig()
        , elementDir = path.join(config.appDir, 'components', config.hyphenName);

      await pify(mkdirp)(elementDir);

      if (config.appScript === 'ts') {
        config.referencePath = path.relative(elementDir, config.appDir);
        config.appScript = 'js';
      }

      await Promise.all([
        this.copyStyleFile('element', path.join(elementDir, config.hyphenName + '.' + config.style), config),
        this.copyMarkupFile('element', path.join(elementDir, config.hyphenName + '.' + config.markup), config),
        this.copySrcFile('element', path.join(elementDir, config.hyphenName + '.' + config.appScript), config)
      ]);

      done();
    };
  }
}
