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
      let config = this.getConfig()
        , markupFile = this.name
        , styleFile;

      // if markupFile doesn't end with .tpl.html, append it
      if (!(/[.]tpl[.]html$/).test(this.name)) {
        markupFile += '.tpl.html';
      }

      // remove TplHtml from lowerCamel
      config.lowerCamel = config.lowerCamel.replace(/TplHtml$/, '');

      // remove TplHtml from ctrlName
      config.ctrlName = config.ctrlName.replace(/TplHtml$/, '');

      // create the style file
      styleFile = markupFile.replace(/tpl[.]html$/, config.style);

      // replace file extension with markup type being used
      markupFile = markupFile.replace(/html$/, config.markup);

      this.copyFile('markup', 'view',
        path.join(config.appDir, config.modulePath, config.structure === 'module-type' ? 'views' : '', markupFile),
        config);
      this.copyStyleFile('view',
        path.join(config.appDir, config.modulePath, config.structure === 'module-type' ? 'views' : '', styleFile),
        config);
    };
  }
}
