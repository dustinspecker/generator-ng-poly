'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').service('<%= lowerCamel %>', function () {
  function <%= upperCamel %> () {}
  <%= upperCamel %>.prototype.get = function () {
    return '<%= lowerCamel %>';
  };

  return new <%= upperCamel %>();
});