<% if (passFunc) { %>(function () {
  <% } %>'use strict';

<% if (passFunc) { %>  <% } %>/**
<% if (passFunc) { %>  <% } %> * @ngdoc directive
<% if (passFunc) { %>  <% } %> * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.directive:<%= lowerCamel %>
<% if (passFunc) { %>  <% } %> * @restrict EA
<% if (passFunc) { %>  <% } %> * @element
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> * @description
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> * @example
<% if (passFunc) { %>  <% } %>   <example module="<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>">
<% if (passFunc) { %>  <% } %>     <file name="index.html">
<% if (passFunc) { %>  <% } %>      <<%= hyphenName %>></<%= hyphenName %>>
<% if (passFunc) { %>  <% } %>     </file>
<% if (passFunc) { %>  <% } %>   </example>
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> */
<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .directive('<%= lowerCamel %>', <%= lowerCamel %>);<% } else { %>
<% if (passFunc) { %>  <% } %>  .directive('<%= lowerCamel %>', function <% if (namedFunc) { %><%= lowerCamel %><% } %>() {
<% if (passFunc) { %>  <% } %>    return {
<% if (passFunc) { %>  <% } %>      restrict: 'AE',
<% if (passFunc) { %>  <% } %>      scope: {},
<% if (passFunc) { %>  <% } %>      templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html',
<% if (passFunc) { %>  <% } %>      replace: false,<% if (controllerAs) { %>
<% if (passFunc) { %>  <% } %>      controllerAs: '<%= lowerCamel %>',<% } %>
<% if (passFunc) { %>  <% } %>      controller: function (<% if (!controllerAs) { %>$scope<% } %>) {
<% if (passFunc) { %>  <% } %>        <% if (controllerAs) { %>var vm = this;
<% if (passFunc) { %>  <% } %>        vm.name = '<%= lowerCamel %>';<% } else { %>$scope.<%= lowerCamel %> = {};
<% if (passFunc) { %>  <% } %>        $scope.<%= lowerCamel %>.name = '<%= lowerCamel %>';<% } %>
<% if (passFunc) { %>  <% } %>      },
<% if (passFunc) { %>  <% } %>      link: function (scope, element, attrs) {
<% if (passFunc) { %>  <% } %>        /*jshint unused:false */
<% if (passFunc) { %>  <% } %>      }
<% if (passFunc) { %>  <% } %>    };
<% if (passFunc) { %>  <% } %>  });<% } %><% if (passFunc) { %>

  function <%= lowerCamel %>() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html',
      replace: false,<% if (controllerAs) { %>
      controllerAs: '<%= lowerCamel %>',<% } %>
      controller: function (<% if (!controllerAs) { %>$scope<% } %>) {
        <% if (controllerAs) { %>var vm = this;
        vm.name = '<%= lowerCamel %>';<% } else { %>$scope.<%= lowerCamel %> = {};
        $scope.<%= lowerCamel %>.name = '<%= lowerCamel %>';<% } %>
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    };
  }
}());<% } %>
