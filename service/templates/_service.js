<% if (passFunc) { %>(function () {
  <% } %>'use strict';

<% if (passFunc) { %>  <% } %>/**
<% if (passFunc) { %>  <% } %> * @ngdoc service
<% if (passFunc) { %>  <% } %> * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.service:<%= upperCamel %>
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> * @description
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> */
<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .service('<%= upperCamel %>', <%= upperCamel %>);<% } else { %>
<% if (passFunc) { %>  <% } %>  .service('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
<% if (passFunc) { %>  <% } %>    var self = this;

<% if (passFunc) { %>  <% } %>    self.get = function <% if (namedFunc) { %>get<% } %>() {
<% if (passFunc) { %>  <% } %>      return '<%= upperCamel %>';
<% if (passFunc) { %>  <% } %>    };
<% if (passFunc) { %>  <% } %>  });<% } %><% if (passFunc) { %>

  function <%= upperCamel %>() {
    var self = this;

    self.get = function <% if (namedFunc) { %>get<% } %>() {
      return '<%= upperCamel %>';
    };
  }
}());<% } %>
