'use strict';<% if (passFunc) { %>

/* @ngInject */
function config($stateProvider) {
  $stateProvider
    .state('<%= moduleName %>', {
      url: '/<%= moduleName %>',
      templateUrl: '<%= templateUrl %>/<%= hyphenName %>.tpl.html',
      controller: '<%= upperModule %>Ctrl<% if (controllerAs) { %> as <%= lowerCamel %><% } %>'
    });
}<% } %>

angular
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
        templateUrl: '<%= templateUrl %>/<%= hyphenName %>.tpl.html',
        controller: '<%= upperModule %>Ctrl<% if (controllerAs) { %> as <%= lowerCamel %><% } %>'
      });
  });<% } %>