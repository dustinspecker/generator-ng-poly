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
<% if (passFunc) { %>  <% } %>      replace: false,
<% if (passFunc) { %>  <% } %>      link: function (scope, element, attrs) {
<% if (passFunc) { %>  <% } %>        element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
<% if (passFunc) { %>  <% } %>      }
<% if (passFunc) { %>  <% } %>    };
<% if (passFunc) { %>  <% } %>  });<% } %><% if (passFunc) { %>

  function <%= lowerCamel %>() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html',
      replace: false,
      link: function (scope, element, attrs) {
        element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
      }
    };
  }

})();<% } %>
