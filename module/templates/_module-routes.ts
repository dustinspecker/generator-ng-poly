///<reference path='<%= referencePath %>' />
module <%= moduleName %> {
  'use strict';

  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .config(config)

  function config() {
  }
}
