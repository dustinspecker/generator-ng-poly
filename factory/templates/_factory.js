'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').factory('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
  var <%= upperCamel %>Base = {};
  <%= upperCamel %>Base.someValue = '<%= upperCamel %>';
  <%= upperCamel %>Base.someMethod = function <% if (namedFunc) { %>someMethod<% } %>() {
    return '<%= upperCamel %>';
  };
  return <%= upperCamel %>Base;
});