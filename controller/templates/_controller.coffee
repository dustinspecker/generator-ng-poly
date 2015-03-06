'use strict'

###*
 # @ngdoc object
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.controller:<%= ctrlName %><% if(!controllerAs) { %>
 # @requires $scope<% } %>

 # @description

###
class <%= ctrlName %>
  constructor: <% if (!controllerAs) { %>(@$scope) <% } %>->
    @ctrlName = '<%= ctrlName %>'

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .controller '<%= ctrlName %>', [<% if (!controllerAs) { %>'$scope, '<% } %><%= ctrlName %>]
