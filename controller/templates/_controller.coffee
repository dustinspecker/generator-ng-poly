'use strict'

###
 # @ngdoc object
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.controller:<%= ctrlName %><% if(!controllerAs) { %>
 # @requires $scope<% } %>
 #
 # @description
 #
###
<% if (classes) { %>
class <%= ctrlName %>
  constructor: <% if (!controllerAs) { %>(@$scope) <% } %>->
    @ctrlName = '<%= ctrlName %>'

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .controller '<%= ctrlName %>', [<% if (!controllerAs) { %>'$scope, '<% } %><%= ctrlName %>]
<% } else { %>
angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .controller '<%= ctrlName %>', <% if (!controllerAs) { %>($scope) <% } %>->
    <% if (controllerAs) { %>vm = @
    vm.ctrlName = '<%= ctrlName %>'<% } else { %>$scope.<%= lowerCamel %> = {}
    $scope.<%= lowerCamel %>.ctrlName = '<%= ctrlName %>'<% } %>
<% } %>
