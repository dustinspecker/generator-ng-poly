<% if (passFunc) { %>(function () {
<% } %>'use strict';<% if (passFunc) { %>

/* @ngdoc object
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>
 * @requires $stateProvider
 *
 * @description
 *
 *
 * @ngInject
 *
 */
function config($stateProvider) {
  $stateProvider
    .state('<%= moduleName %>', {
      url: '/<%= moduleName %>',
      templateUrl: '<%= templateUrl %>/<%= moduleName %>.tpl.html',
      controller: '<%= upperModule %>Ctrl<% if (controllerAs) { %> as <%= moduleName %><% } %>'
    });
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
    'ui.router'
  ]);

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .config(config);<% } else { %>
  .config(function <% if (namedFunc) { %>config<% } %>($stateProvider) {
    $stateProvider
      .state('<%= moduleName %>', {
        url: '/<%= moduleName %>',
        templateUrl: '<%= templateUrl %>/<%= moduleName %>.tpl.html',
        controller: '<%= upperModule %>Ctrl<% if (controllerAs) { %> as <%= moduleName %><% } %>'
      });
  });<% } %>
<% if (passFunc) { %>
})();<% } %>