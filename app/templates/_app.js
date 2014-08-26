<% if (passFunc) { %>(function () {
  <% } %>'use strict';<% if (passFunc) { %>

  /* @ngdoc object
   * @name <%= moduleName %>
   * @requires <% if (ngRoute) { %>$routeProvider<% } else { %>$urlRouterProvider<% } %>
   *
   * @description
   *
   *
   * @ngInject
   *
   */
  function config(<% if (ngRoute) { %>$routeProvider<% } else { %>$urlRouterProvider<% } %>) {
    <% if (ngRoute) { %>$routeProvider.otherwise({
      redirectTo: '/home'
    });<% } else { %>$urlRouterProvider.otherwise('/home');<% } %>
  }<% } %>

<% if (!passFunc) { %>/* @ngdoc object
 * @name <%= moduleName %>
 * @requires <% if (ngRoute) { %>$routeProvider<% } else { %>$urlRouterProvider<% } %>
 *
 * @description
 *
 *
 * @ngInject
 *
 */
<% } %><% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<%= moduleName %>', [
<% if (passFunc) { %>  <% } %>    <% if (ngRoute) { %>'ngRoute'<% } else { %>'ui.router'<% } %><% if (framework === 'angularstrap') { %>,
<% if (passFunc) { %>  <% } %>    'mgcrea.ngStrap'<% } %><% if (framework === 'uibootstrap') { %>,
<% if (passFunc) { %>  <% } %>    'ui.bootstrap'<% } %><% if (framework === 'foundation') { %>,
<% if (passFunc) { %>  <% } %>    'mm.foundation'<% } %>
<% if (passFunc) { %>  <% } %>  ]);
<% if (passFunc) { %>  <% } %>
<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .config(config);<% } else { %>
<% if (passFunc) { %>  <% } %>  .config(function <% if (namedFunc) { %>config<% } %>(<% if (ngRoute) { %>$routeProvider<% } else { %>$urlRouterProvider<% } %>) {
<% if (passFunc) { %>  <% } %>    <% if (ngRoute) { %>$routeProvider.otherwise({
<% if (passFunc) { %>  <% } %>      redirectTo: '/home'
<% if (passFunc) { %>  <% } %>    });<% } else { %>$urlRouterProvider.otherwise('/home');<% } %>
<% if (passFunc) { %>  <% } %>  });<% } %>
<% if (passFunc) { %>
})();<% } %>
