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
<% } %>angular
  .module('<%= moduleName %>', [
    <% if (ngRoute) { %>'ngRoute'<% } else { %>'ui.router'<% } %><% if (framework === 'angularstrap') { %>,
    'mgcrea.ngStrap'<% } %><% if (framework === 'foundation') { %>,
    'mm.foundation'<% } %>
  ]);

angular
  .module('<%= moduleName %>')<% if (passFunc) { %>
  .config(config);<% } else { %>
  .config(function <% if (namedFunc) { %>config<% } %>(<% if (ngRoute) { %>$routeProvider<% } else { %>$urlRouterProvider<% } %>) {
    <% if (ngRoute) { %>$routeProvider.otherwise({
      redirectTo: '/home'
    });<% } else { %>$urlRouterProvider.otherwise('/home');<% } %>
  });<% } %>
<% if (passFunc) { %>
})();<% } %>