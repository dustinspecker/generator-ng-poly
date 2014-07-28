'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').provider('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
  return {
    $get: function () {
      return '<%= upperCamel %>';
    }
  };
});