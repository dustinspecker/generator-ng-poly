'use strict';<% if (passFunc) { %>

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
<% } %>angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .factory('<%= upperCamel %>', <%= upperCamel %>);<% } else { %>
  .factory('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
    var <%= upperCamel %>Base = {};
    <%= upperCamel %>Base.someValue = '<%= upperCamel %>';
    <%= upperCamel %>Base.someMethod = function <% if (namedFunc) { %>someMethod<% } %>() {
      return '<%= upperCamel %>';
    };
    return <%= upperCamel %>Base;
  });<% } %>