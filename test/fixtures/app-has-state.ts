///<reference path=references.d.ts' />

'use strict';

/* @ngdoc object
 * @name home
 * @requires $stateProvider
 *
 * @description
 *
 *
 */
angular
  .module('home', [
    'ui.router'
  ]);

angular
  .module('home')
  .config(function ($stateProvider: ng.ui.IStateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home/home.tpl.html',
        controller: 'HomeCtrl'
      });
  });
