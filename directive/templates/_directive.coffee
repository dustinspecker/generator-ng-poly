'use strict'
###
 # @ngdoc directive
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.directive:<%= lowerCamel %>
 # @restrict EA
 # @element
 #
 # @description
 #
 # @example
   <example module="<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>">
     <file name="index.html">
      <<%= hyphenName %>></<%= hyphenName %>>
     </file>
   </example>
 #
###
<% if (classes) { %>
class <%= upperCamel %>
  constructor: ->
    return {
      restrict: 'AE'
      scope: {}
      templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'
      replace: false<% if (controllerAs) { %>
      controllerAs: '<%= lowerCamel %>'<% } %>
      controller:<% if (!controllerAs) { %> ($scope)<% } %> ->
        <% if (controllerAs) { %>vm = @
        vm.name = '<%= lowerCamel %>'<% } else { %>$scope.<%= lowerCamel %> = {}
        $scope.<%= lowerCamel %>.name = '<%= lowerCamel %>'<% } %>
      link: (scope, element, attrs) ->
        ###jshint unused:false ###
    }

angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .directive '<%= lowerCamel %>', [<%= upperCamel %>]
<% } else { %>
angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .directive '<%= lowerCamel %>', ->
    restrict: 'AE'
    scope: {}
    templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'
    replace: false<% if (controllerAs) { %>
    controllerAs: '<%= lowerCamel %>'<% } %>
    controller:<% if (!controllerAs) { %> ($scope)<% } %> ->
      <% if (controllerAs) { %>vm = @
      vm.name = '<%= lowerCamel %>'<% } else { %>$scope.<%= lowerCamel %> = {}
      $scope.<%= lowerCamel %>.name = '<%= lowerCamel %>'<% } %>
    link: (scope, element, attrs) ->
      ###jshint unused:false ###
<% } %>
