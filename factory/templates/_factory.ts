///<reference path='<%= referencePath %>' />
module <%= upperCamel %> {
  'use strict';

  /**
  * @ngdoc service
  * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.factory:<%= upperCamel %>
  *
  * @description
  *
  */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .factory('<%= upperCamel %>', <%= upperCamel %>);

  interface <%= upperCamel %>Interface {
    someValue?: string
    someMethod?: Function
  }

  function <%= upperCamel %>() {
    var <%= upperCamel %>Base:<%= upperCamel %>Interface = {};
    <%= upperCamel %>Base.someValue = '<%= upperCamel %>';
    <%= upperCamel %>Base.someMethod = function <% if (namedFunc) {%>someMethod<% } %>() {
      return '<%= upperCamel %>';
    };
    return <%= upperCamel %>Base;
  }
}
