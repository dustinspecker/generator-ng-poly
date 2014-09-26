<% if (passFunc) { %>(function () {
  <% } %>'use strict';

<% if (passFunc) { %>  <% } %>/* @ngdoc object
<% if (passFunc) { %>  <% } %> * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>
<% if (passFunc) { %>  <% } %> * @requires <% if (ngRoute) { %>$routeProvider<% } else { %>$stateProvider<% } %>
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> * @description
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> */
<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', [
<% if (passFunc) { %>  <% } %>  ]);

<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .config(config);<% } else { %>
<% if (passFunc) { %>  <% } %>  .config(function <% if (namedFunc) { %>config<% } %>() {
<% if (passFunc) { %>  <% } %>  });<% } %><% if (passFunc) { %>

  function config() {
  }

})();<% } %>
