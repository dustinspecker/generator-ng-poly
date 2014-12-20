///<reference path='<%= referencePath %>' />
module <%= ctrlName %> {
  'use strict';

  class <%= ctrlName %> {<% if (controllerAs) { %>

    ctrlName: string<% } %>

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [<% if (!controllerAs) { %>
      '$scope' <% } %>
    ];

    // dependencies are injected via AngularJS $injector
    constructor(<% if (!controllerAs) { %> $scope: ng.IScope <% } %>) {
      <% if (controllerAs) { %>var vm = this;
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
}
