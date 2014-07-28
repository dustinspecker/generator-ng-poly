'use strict';<% if (passFunc) { %>

/* @ngInject */
function <%= upperCamel %>() {
  return {
    $get: function () {
      return '<%= upperCamel %>';
    }
  };
}<% } %>

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .provider('<%= upperCamel %>', <%= upperCamel %>);<% } else { %>
  .provider('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
    return {
      $get: function () {
        return '<%= upperCamel %>';
      }
    };
  });<% } %>