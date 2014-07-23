'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').provider('<%= lowerCamel %>', function () {
  return {
    $get: function () {
      return '<%= lowerCamel %>';
    }
  };
});