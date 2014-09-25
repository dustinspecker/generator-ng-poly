<% if (passFunc) { %>(function () {
  <% } %>'use strict';

<% if (passFunc) { %>  <% } %>/**
<% if (passFunc) { %>  <% } %> * @ngdoc object
<% if (passFunc) { %>  <% } %> * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.controller:<%= ctrlName %><% if(!controllerAs) { %>
<% if (passFunc) { %>  <% } %> * @requires $scope <% } %>
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> * @description
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> */
<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .controller('<%= ctrlName %>', <%= ctrlName %>);<% } else { %>
<% if (passFunc) { %>  <% } %>  .controller('<%= ctrlName %>', function <% if (namedFunc) { %><%= ctrlName %><% } %>(<% if (!controllerAs) { %>$scope<% } %>) {
<% if (passFunc) { %>  <% } %>    <% if (controllerAs) { %>var vm = this;
<% if (passFunc) { %>  <% } %>    vm.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.ctrlName = '<%= ctrlName %>';<% } %>
<% if (passFunc) { %>  <% } %>  });<% } %><% if (passFunc) { %>

  function <%= ctrlName %>(<% if (!controllerAs) { %>$scope<% } %>) {
    <% if (controllerAs) { %>var vm = this;
    vm.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.ctrlName = '<%= ctrlName %>';<% } %>
  }

})();<% } %>
