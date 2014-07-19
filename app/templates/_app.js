'use strict';

angular.module('<%= moduleName %>', ['ui.router', 'home']);

angular.module('<%= moduleName %>').config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
});