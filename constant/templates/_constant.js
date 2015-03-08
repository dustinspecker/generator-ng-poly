<% if (passFunc) { %>(function () {
  <% } %>'use strict';

<% if (passFunc) { %>  <% } %>/**
<% if (passFunc) { %>  <% } %> * @ngdoc service
<% if (passFunc) { %>  <% } %> * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.constant:<%= upperCamel %>
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> * @description
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> */
<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
<% if (passFunc) { %>  <% } %>  .constant('<%= upperCamel %>', 0);<% if (passFunc) { %>
}());<% } %>
