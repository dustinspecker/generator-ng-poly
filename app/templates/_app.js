'use strict';

angular.module('<%= appName %>', ['ui.router']);

angular.module('<%= appName %>').config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
});