<% if (passFunc) { %>(function () {
  <% } %>'use strict';<% if (passFunc) { %>

  /* @ngdoc object
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>
   * @requires <% if (ngRoute) { %>$routeProvider<% } else { %>$stateProvider<% } %>
   *
   * @description
   *
   *
   * @ngInject
   *
   */
  function config() {
  }<% } %>

<% if (!passFunc) { %>/* @ngdoc object
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>
 * @requires <% if (ngRoute) { %>$routeProvider<% } else { %>$stateProvider<% } %>
 *
 * @description
 *
 *
 */
<% } %><% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', [
<% if (passFunc) { %>  <% } %>  ]);

<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .config(config);<% } else { %>
<% if (passFunc) { %>  <% } %>  .config(function <% if (namedFunc) { %>config<% } %>() {
<% if (passFunc) { %>  <% } %>  });<% } %>
<% if (passFunc) { %>
})();<% } %>
