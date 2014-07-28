'use strict';<% if (passFunc) { %>

/* @ngInject */
function <%= ctrlName %>(<% if (!controllerAs) { %>$scope<% } %>) {
  <% if (controllerAs) { %>this.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.ctrlName = '<%= ctrlName %>';<% } %>
}<% } %>

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .controller('<%= ctrlName %>', <%= ctrlName %>);<% } else { %>
  .controller('<%= ctrlName %>', function <% if (namedFunc) { %><%= ctrlName %><% } %>(<% if (!controllerAs) { %>$scope<% } %>) {
    <% if (controllerAs) { %>this.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.ctrlName = '<%= ctrlName %>';<% } %>
  });<% } %>