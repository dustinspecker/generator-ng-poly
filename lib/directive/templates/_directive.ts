///<reference path='<%= referencePath %>' />
function <%= upperCamel %>Directive(): ng.IDirective {
  'use strict';
  return {
        restrict: 'EA',
        scope: {},<% if (directiveTemplateUrl) { %>
        templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'<% } else { %>,
        template: '<div>{{<%= lowerCamel %>.name}}</div>'<% } %>,
        replace: false,<% if (controllerAs) { %>
        controllerAs: '<%= lowerCamel %>',
        controller: function (<% if (!controllerAs) { %>$scope: ng.IScope<% } %>) {
        <% if (controllerAs) { %>var vm = this;
            vm.name = '<%= lowerCamel %>';<% } else { %>$scope.<%= lowerCamel %> = {};
            $scope.<%= lowerCamel %>.name = '<%= lowerCamel %>';<% } %>
    },
    link: (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes): void => {
      /*jshint unused:false */
      /*eslint "no-unused-vars": [2, {"args": "none"}]*/
    }
  }
}
  <% if (!controllerAs) { %>
    module <%= upperCamel %> {
          'use strict';
  export class <%= upperCamel %>Controller {
    public static $inject: Array<string> = [];
      constructor() {
        /*jshint unused:false */
      }
    }
  }
    <% } %>
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