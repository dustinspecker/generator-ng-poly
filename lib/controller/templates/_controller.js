(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.controller:<%= ctrlName %><% if(!controllerAs) { %>
   * @requires $scope<% } %>
   *
   * @description
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .controller('<%= ctrlName %>', <%= ctrlName %>);

  function <%= ctrlName %>(<% if (!controllerAs) { %>$scope<% } %>) {
    <% if (controllerAs) { %>var vm = this;
    vm.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.<%= lowerCamel %> = {};
    $scope.<%= lowerCamel %>.ctrlName = '<%= ctrlName %>';<% } %>
  }
}());
