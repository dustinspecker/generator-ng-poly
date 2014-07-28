'use strict';

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .constant('<%= upperCamel %>', 0);