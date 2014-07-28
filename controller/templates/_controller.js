'use strict';<% if (passFunc) { %>

/**
 * @ngdoc object
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.controller:<%= ctrlName %><% if(!controllerAs) { %>
 * @requires $scope <% } %>
 * @function
 * 
 * @description
 * 
 *
 * @ngInject
 *
 */
function <%= ctrlName %>(<% if (!controllerAs) { %>$scope<% } %>) {
  <% if (controllerAs) { %>this.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.ctrlName = '<%= ctrlName %>';<% } %>
}<% } %>

<% if (!passFunc) { %>/**
 * @ngdoc object
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.controller:<%= ctrlName %><% if(!controllerAs) { %>
 * @requires $scope <% } %>
 * 
 * @description
 * 
 *
 */
<% } %>angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .controller('<%= ctrlName %>', <%= ctrlName %>);<% } else { %>
  .controller('<%= ctrlName %>', function <% if (namedFunc) { %><%= ctrlName %><% } %>(<% if (!controllerAs) { %>$scope<% } %>) {
    <% if (controllerAs) { %>this.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.ctrlName = '<%= ctrlName %>';<% } %>
  });<% } %>