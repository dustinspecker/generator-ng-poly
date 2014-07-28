'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').controller('<%= ctrlName %>', function <% if (namedFunc) { %><%= ctrlName %><% } %>(<% if (!controllerAs) { %>$scope<% } %>) {
  <% if (controllerAs) { %>this.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.ctrlName = '<%= ctrlName %>';<% } %>
});