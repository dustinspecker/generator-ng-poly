(() => {
  'use strict';

  /* @ngdoc object
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= lowerCamel %>
   * @requires <% if (ngRoute) { %>$routeProvider<% } else { %>$stateProvider<% } %>
   *
   * @description
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= lowerCamel %>', [
    ]);

  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= lowerCamel %>')
    .config(config);

  function config() {
  }
}());
