'use strict'

angular
  .module '<%= moduleName %>'
  .config (<% if (ngRoute) { %>$routeProvider<% } else { %>$urlRouterProvider<% } %>) ->
    <% if (ngRoute) { %>$routeProvider.otherwise {
      redirectTo: '/home'
    }<% } else { %>$urlRouterProvider.otherwise '/home'<% } %>
