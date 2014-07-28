'use strict';<% if (passFunc) { %>

/* @ngInject */
function config($urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
}<% } %>

angular
  .module('<%= moduleName %>', [
    'ui.router'
  ]);

angular
  .module('<%= moduleName %>')<% if (passFunc) { %>
  .config(config);<% } else { %>
  .config(function <% if (namedFunc) { %>config<% } %>($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  });<% } %>