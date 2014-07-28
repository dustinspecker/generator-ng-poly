'use strict';

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .value('<%= upperCamel %>', 0);