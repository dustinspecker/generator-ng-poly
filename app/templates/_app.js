'use strict';

angular.module('<%= moduleName %>', [
  'ui.router'
]);

angular.module('<%= moduleName %>').config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});