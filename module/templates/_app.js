<% if (passFunc) { %>(function () {
<% } %>'use strict';<% if (passFunc) { %>

/* @ngdoc object
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>
 *
 * @description
 *
 *
 * @ngInject
 *
 */
function config() {
}<% } %>

<% if (!passFunc) { %>/* @ngdoc object
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>
 * @requires $stateProvider
 *
 * @description
 *
 *
 */
<% } %>angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', [
  ]);

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .config(config);<% } else { %>
  .config(function <% if (namedFunc) { %>config<% } %>() {
  });<% } %>
<% if (passFunc) { %>
})();<% } %>