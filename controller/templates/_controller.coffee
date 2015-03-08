'use strict'

###*
 # @ngdoc object
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.controller:<%= ctrlName %><% if(!controllerAs) { %>
 # @requires $scope<% } %>

 # @description

###
class <%= ctrlName %>
  constructor: <% if (!controllerAs) { %>($scope) <% } %>->
    <% if (controllerAs) { %>@ctrlName = '<%= ctrlName %>'<% } else { %>$scope.<%= lowerCamel %> = {}
    $scope.<%= lowerCamel %>.ctrlName = '<%= ctrlName %>'<% } %>

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .controller '<%= ctrlName %>', <%= ctrlName %>
