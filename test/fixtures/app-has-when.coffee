'use strict'

###
 # @ngdoc object
 # @name home
 # @requires $routeProvider
 #
 # @description
 #
 #
 # @ngInject
 #
###
angular
  .module 'home', [
    'ngRoute'
  ]

angular
  .module 'home'
  .config ($routeProvider) ->
    $routeProvider
      .when '/home',
        templateUrl: 'home/home.tpl.html'
        controller: 'HomeCtrl'
