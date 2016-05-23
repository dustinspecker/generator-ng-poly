'use strict';
import 'babel-polyfill';
import genBase from '../genBase';
import path from 'path';

module.exports = genBase.extend({
  prompting() {
    return this.askForModuleName();
  },

  async writing() {
    const config = await this.getConfig();

    let markupFile = this.name;

    // if markupFile doesn't end with .tpl.html, append it
    if (!(/[.]tpl[.]html$/).test(this.name)) {
      markupFile += '.tpl.html';
    }

    // remove TplHtml from lowerCamel
    config.lowerCamel = config.lowerCamel.replace(/TplHtml$/, '');

    // remove TplHtml from ctrlName
    config.ctrlName = config.ctrlName.replace(/TplHtml$/, '');

    // create the style file
    const styleFile = markupFile.replace(/tpl[.]html$/, config.style);

    // replace file extension with markup type being used
    markupFile = markupFile.replace(/html$/, config.markup);

    return Promise.all([
      this.copyFile('markup', 'view',
        path.join(config.appDir, config.modulePath, config.structure === 'module-type' ? 'views' : '', markupFile),
        config),
      this.copyStyleFile('view',
        path.join(config.appDir, config.modulePath, config.structure === 'module-type' ? 'views' : '', styleFile),
        config)
    ]);
  }
});
