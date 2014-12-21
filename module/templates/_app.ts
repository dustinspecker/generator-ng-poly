///<reference path='<%= referencePath %>' />
module <%= moduleName %> {
  'use strict';

  /* @ngdoc object
  * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>
  * @requires <% if (ngRoute) { %>$routeProvider<% } else { %>$stateProvider<% } %>
  *
  * @description
  *
  */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', [
    ]);

  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .config(config)

  function config() {
  }
}
