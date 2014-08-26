<% if (passFunc) { %>(function () {
  <% } %>'use strict';<% if (passFunc) { %>

  /**
   * @ngdoc service
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.provider:<%= upperCamel %>
   * @function
   *
   * @description
   *
   * @ngInject 
   *
   */
  function <%= upperCamel %>() {
    return {
      $get: function () {
        return '<%= upperCamel %>';
      }
    };
  }<% } %>

<% if (!passFunc) { %>/**
 * @ngdoc service
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.provider:<%= upperCamel %>
 * @function
 *
 * @description
 *
 *
 */
<% } %><% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .provider('<%= upperCamel %>', <%= upperCamel %>);<% } else { %>
<% if (passFunc) { %>  <% } %>  .provider('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
<% if (passFunc) { %>  <% } %>    return {
<% if (passFunc) { %>  <% } %>      $get: function () {
<% if (passFunc) { %>  <% } %>        return '<%= upperCamel %>';
<% if (passFunc) { %>  <% } %>      }
<% if (passFunc) { %>  <% } %>    };
<% if (passFunc) { %>  <% } %>  });<% } %>
<% if (passFunc) { %>
})();<% } %>
