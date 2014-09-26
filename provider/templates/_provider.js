<% if (passFunc) { %>(function () {
  <% } %>'use strict';

<% if (passFunc) { %>  <% } %>/**
<% if (passFunc) { %>  <% } %> * @ngdoc service
<% if (passFunc) { %>  <% } %> * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.provider:<%= upperCamel %>
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> * @description
<% if (passFunc) { %>  <% } %> *
<% if (passFunc) { %>  <% } %> */
<% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .provider('<%= upperCamel %>', <%= upperCamel %>);<% } else { %>
<% if (passFunc) { %>  <% } %>  .provider('<%= upperCamel %>', function <% if (namedFunc) { %><%= upperCamel %><% } %>() {
<% if (passFunc) { %>  <% } %>    return {
<% if (passFunc) { %>  <% } %>      $get: function () {
<% if (passFunc) { %>  <% } %>        return '<%= upperCamel %>';
<% if (passFunc) { %>  <% } %>      }
<% if (passFunc) { %>  <% } %>    };
<% if (passFunc) { %>  <% } %>  });<% } %><% if (passFunc) { %>

  function <%= upperCamel %>() {
    return {
      $get: function () {
        return '<%= upperCamel %>';
      }
    };
  }

})();<% } %>
