'use strict'

### @ngdoc object
 # @name <%= moduleName %>
 # @requires <% if (ngRoute) { %>$routeProvider<% } else { %>$urlRouterProvider<% } %>
 #
 # @description
 #
###
angular
  .module '<%= moduleName %>', [<% if (bower.indexOf('aria') > -1) { %>
    'ngAria',<% } %>
    <% if (ngRoute) { %>'ngRoute'<% } else { %>'ui.router'<% } %><% if (framework === 'angularstrap') { %>,
    'mgcrea.ngStrap'<% } %><% if (framework === 'uibootstrap') { %>,
    'ui.bootstrap'<% } %><% if (framework === 'foundation') { %>,
    'mm.foundation'<% } %><% if (material) { %>,
    'ngMaterial'<% } %>
  ]

angular
  .module '<%= moduleName %>'
  .config (<% if (ngRoute) { %>$routeProvider<% } else { %>$urlRouterProvider<% } %>) ->
    <% if (ngRoute) { %>$routeProvider.otherwise {
      redirectTo: '/home'
    }<% } else { %>$urlRouterProvider.otherwise '/home'<% } %>
