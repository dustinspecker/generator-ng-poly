'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').provider('<%= upperCamel %>', function () {
  return {
    $get: function () {
      return '<%= upperCamel %>';
    }
  };
});