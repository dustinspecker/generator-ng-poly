'use strict';<% if (passFunc) { %>

/**
 * @ngdoc service
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.service:<%= upperCamel %>
 * @function
 *
 * @description
 *
 * @ngInject 
 *
 */
function <%= upperCamel %>() {
  function <%= upperCamel %>Base() {}
  <%= upperCamel %>Base.prototype.get = function <% if (namedFunc) { %>get<% } %>() {
    return '<%= upperCamel %>';
  };

  return new <%= upperCamel %>Base();
}<% } %>

<% if (!passFunc) { %>/**
 * @ngdoc service
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.service:<%= upperCamel %>
 * @function
 *
 * @description
 *
 *
 */
<% } %>angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .service('<%= upperCamel %>', <%= upperCamel %>);<% } else { %>
  .service('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
    function <%= upperCamel %>Base() {}
    <%= upperCamel %>Base.prototype.get = function <% if (namedFunc) { %>get<% } %>() {
      return '<%= upperCamel %>';
    };

    return new <%= upperCamel %>Base();
  });<% } %>