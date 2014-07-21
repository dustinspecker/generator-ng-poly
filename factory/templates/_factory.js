'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').factory('<%= lowerCamel %>', function () {
  return '<%= lowerCamel %>';
});