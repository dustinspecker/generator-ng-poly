'use strict';<% if (passFunc) { %>

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
<% } %>angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .provider('<%= upperCamel %>', <%= upperCamel %>);<% } else { %>
  .provider('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
    return {
      $get: function () {
        return '<%= upperCamel %>';
      }
    };
  });<% } %>