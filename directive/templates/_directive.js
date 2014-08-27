<% if (passFunc) { %>(function () {
  <% } %>'use strict';<% if (passFunc) { %>

  /**
   * @ngdoc directive
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.directive:<%= lowerCamel %>
   * @restrict EA
   * @element
   * @function
   *
   * @description
   * Change the element's text to <%= lowerCamel %>\nscope\nattrs
   *
   * @example
     <example module="<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>">
       <file name="index.html">
        <<%= hyphenName %>></<%= hyphenName %>>
       </file>
     </example>
   *
   * @ngInject
   *
   */
  function <%= lowerCamel %>() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: '<%= modulePath %>/<%= hyphenName %>-directive.tpl.html',
      replace: false,
      link: function (scope, element, attrs) {
        element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
      }
    };
  }<% } %>

<% if (!passFunc) { %>/**
 * @ngdoc directive
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.directive:<%= lowerCamel %>
 * @restrict EA
 * @element
 * 
 * @description
 * Change the element's text to <%= lowerCamel %>\nscope\nattrs
 *
 * @example
   <example module="<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>">
     <file name="index.html">
      <<%= hyphenName %>></<%= hyphenName %>>
     </file>
   </example>
 *
 */
<% } %><% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .directive('<%= lowerCamel %>', <%= lowerCamel %>);<% } else { %>
<% if (passFunc) { %>  <% } %>  .directive('<%= lowerCamel %>', function <% if (namedFunc) { %><%= lowerCamel %><% } %>() {
<% if (passFunc) { %>  <% } %>    return {
<% if (passFunc) { %>  <% } %>      restrict: 'AE',
<% if (passFunc) { %>  <% } %>      scope: {},
<% if (passFunc) { %>  <% } %>      templateUrl: '<%= modulePath %>/<%= hyphenName %>-directive.tpl.html',
<% if (passFunc) { %>  <% } %>      replace: false,
<% if (passFunc) { %>  <% } %>      link: function (scope, element, attrs) {
<% if (passFunc) { %>  <% } %>        element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
<% if (passFunc) { %>  <% } %>      }
<% if (passFunc) { %>  <% } %>    };
<% if (passFunc) { %>  <% } %>  });<% } %>
<% if (passFunc) { %>
})();<% } %>
