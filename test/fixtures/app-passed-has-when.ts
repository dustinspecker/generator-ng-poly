///<reference path=references.d.ts' />

'use strict';

/* @ngdoc object
 * @name home
 * @requires $routeProvider
 *
 * @description
 *
 *
 * @ngInject
 *
 */
function config($routeProvider: ng.route.IRouteProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'home/home.tpl.html',
      controller: 'HomeCtrl'
    });
}

angular
  .module('home', [
    'ngRoute'
  ]);

angular
  .module('home')
  .config(config);
