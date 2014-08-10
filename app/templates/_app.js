<% if (passFunc) { %>(function () {
<% } %>'use strict';<% if (passFunc) { %>

/* @ngdoc object
 * @name <%= moduleName %>
 * @requires $urlRouterProvider
 *
 * @description
 *
 *
 * @ngInject
 *
 */
function config($urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
}<% } %>

<% if (!passFunc) { %>/* @ngdoc object
 * @name <%= moduleName %>
 * @requires $urlRouterProvider
 *
 * @description
 *
 *
 * @ngInject
 *
 */
<% } %>angular
  .module('<%= moduleName %>', [
    'ui.router'<% if (framework === 'angularstrap') { %>,
    'mgcrea.ngStrap'<% } %>
  ]);

angular
  .module('<%= moduleName %>')<% if (passFunc) { %>
  .config(config);<% } else { %>
  .config(function <% if (namedFunc) { %>config<% } %>($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  });<% } %>
<% if (passFunc) { %>
})();<% } %>