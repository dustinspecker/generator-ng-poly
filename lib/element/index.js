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
    return function () {
      let config = this.getConfig()
        , done = this.async()
        , elementDir = path.join(config.appDir, 'components', config.hyphenName);

      pify(mkdirp)(elementDir).then(() => {
        if (config.appScript === 'ts') {
          config.referencePath = path.relative(elementDir, config.appDir);
          config.appScript = 'js';
        }

        this.copyStyleFile('element', path.join(elementDir, config.hyphenName + '.' + config.style), config);
        this.copyMarkupFile('element', path.join(elementDir, config.hyphenName + '.' + config.markup), config);
        this.copySrcFile('element', path.join(elementDir, config.hyphenName + '.' + config.appScript), config);

        done();
      });
    };
  }
}
