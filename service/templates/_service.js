'use strict';

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .service('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
    function <%= upperCamel %>Base() {}
    <%= upperCamel %>Base.prototype.get = function <% if (namedFunc) { %>get<% } %>() {
      return '<%= upperCamel %>';
    };

    return new <%= upperCamel %>Base();
  });