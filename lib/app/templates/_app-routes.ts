///<reference path='../typings/tsd.d.ts' />
module <%= moduleName %> {
  'use strict';

  angular
    .module('<%= moduleName %>')
    .config(config);

  function config(<% if (ngRoute) { %>$routeProvider: ng.route.IRouteProvider<% } else { %>$urlRouterProvider: ng.ui.IUrlRouterProvider<% } %>) {
    <% if (ngRoute) { %>$routeProvider.otherwise({
      redirectTo: '/home'
    });<% } else { %>$urlRouterProvider.otherwise('/home');<% } %>
  }
}
