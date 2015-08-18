(function () {
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

  function <%= lowerCamel %>() {
    return {
      restrict: 'EA',
      scope: {}<% if (directiveTemplateUrl) { %>,
      templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'<% } else { %>,
      template: '<div>{{<%= lowerCamel %>.name}}</div>'<% } %>,
      replace: false,<% if (controllerAs) { %>
      controllerAs: '<%= lowerCamel %>',<% } %>
      controller(<% if (!controllerAs) { %>$scope<% } %>) {
        <% if (controllerAs) { %>let vm = this;
        vm.name = '<%= lowerCamel %>';<% } else { %>$scope.<%= lowerCamel %> = {};
        $scope.<%= lowerCamel %>.name = '<%= lowerCamel %>';<% } %>
      },
      link(scope, element, attrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */
      }
    };
  }
}());
