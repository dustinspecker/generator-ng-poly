(function () {
  'use strict';

  class <%= ctrlName %> {
    constructor(<% if (!controllerAs) { %>$scope<% } %>) {
      <% if (controllerAs) { %>let vm = this;
      vm.ctrlName = '<%= ctrlName %>';<% } else { %>$scope.<%= lowerCamel %> = {};
      $scope.<%= lowerCamel %>.ctrlName = '<%= ctrlName %>';<% } %>
    }
  }

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
}());
