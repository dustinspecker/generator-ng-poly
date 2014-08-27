<% if (passFunc) { %>(function () {
  <% } %>'use strict';<% if (passFunc) { %>

  /**
   * @ngdoc service
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.factory:<%= upperCamel %>
   * @function
   *
   * @description
   *
   *
   * @ngInject
   *
   */
  function <%= upperCamel %>() {
    var <%= upperCamel %>Base = {};
    <%= upperCamel %>Base.someValue = '<%= upperCamel %>';
    <%= upperCamel %>Base.someMethod = function <% if (namedFunc) { %>someMethod<% } %>() {
      return '<%= upperCamel %>';
    };
    return <%= upperCamel %>Base;
  }<% } %>

<% if (!passFunc) { %>/**
 * @ngdoc service
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.factory:<%= upperCamel %>
 * 
 * @description
 *
 *
 */
<% } %><% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .factory('<%= upperCamel %>', <%= upperCamel %>);<% } else { %>
<% if (passFunc) { %>  <% } %>  .factory('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
<% if (passFunc) { %>  <% } %>    var <%= upperCamel %>Base = {};
<% if (passFunc) { %>  <% } %>    <%= upperCamel %>Base.someValue = '<%= upperCamel %>';
<% if (passFunc) { %>  <% } %>    <%= upperCamel %>Base.someMethod = function <% if (namedFunc) { %>someMethod<% } %>() {
<% if (passFunc) { %>  <% } %>      return '<%= upperCamel %>';
<% if (passFunc) { %>  <% } %>    };
<% if (passFunc) { %>  <% } %>    return <%= upperCamel %>Base;
<% if (passFunc) { %>  <% } %>  });<% } %>
<% if (passFunc) { %>
})();<% } %>
