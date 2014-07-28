'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').service('<%= upperCamel %>', function () {
  function <%= upperCamel %> () {}
  <%= upperCamel %>.prototype.get = function () {
    return '<%= upperCamel %>';
  };

  return new <%= upperCamel %>();
});