'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').factory('<%= upperCamel %>', function () {
  return '<%= upperCamel %>';
});