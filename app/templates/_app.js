'use strict';

angular.module('<%= moduleName %>', [
  'ui.router'
]);

angular.module('<%= moduleName %>').config(function <% if (namedFunc) { %>config<% } %>($urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});