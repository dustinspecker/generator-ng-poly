///<reference path='<%= referencePath %>' />
module <%= upperCamel %> {
  'use strict';

  /**
  * @ngdoc directive
  * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.directive:<%= lowerCamel %>
  * @restrict EA
  * @element
  *
  * @description
  *
  * @example
    <example module="<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>">
      <file name="index.html">
        <<%= hyphenName %>></<%= hyphenName %>>
      </file>
    </example>
  *
  */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .directive('<%= lowerCamel %>', <%= lowerCamel %>);

  function <%= lowerCamel %>(): ng.IDirective {
    return {
      restrict: 'EA',
      scope: {}<% if (directiveTemplateUrl) { %>,
      templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'<% } else { %>,
      template: '<div>{{<%= lowerCamel %>.name}}</div>'<% } %>,
      replace: false,<% if (controllerAs) { %>
      controllerAs: '<%= lowerCamel %>',<% } %>
      controller: function (<% if (!controllerAs) { %>$scope: ng.IScope<% } %>) {
        <% if (controllerAs) { %>var vm = this;
        vm.name = '<%= lowerCamel %>';<% } else { %>$scope.<%= lowerCamel %> = {};
        $scope.<%= lowerCamel %>.name = '<%= lowerCamel %>';<% } %>
      },
      link: function (scope: ng.IScope, element: JQuery, attrs: any) {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    };
  }
}
