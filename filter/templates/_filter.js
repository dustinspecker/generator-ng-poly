<% if (passFunc) { %>(function () {
  <% } %>'use strict';<% if (passFunc) { %>

  /**
   * @ngdoc filter
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.filter:<%= lowerCamel %>
   *
   * @description
   *
   *
   * @param {Array} input The array of numbers to filter
   * @returns {Array} The filtered array
   *
   * @ngInject 
   *
   */
  function <%= lowerCamel %>() {
    return function (input) {
      var temp = [];
      angular.forEach(input, function (item) {
        if(item > 3) {
          temp.push(item);
        }
      });
      return temp;
    };
  }<% } %>

<% if (!passFunc) { %>/**
 * @ngdoc filter
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.filter:<%= lowerCamel %>
 *
 * @description
 *
 *
 * @param {Array} input The array of numbers to filter
 * @returns {Array} The filtered array
 *
 */
<% } %><% if (passFunc) { %>  <% } %>angular
<% if (passFunc) { %>  <% } %>  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
<% if (passFunc) { %>  <% } %>  .filter('<%= lowerCamel %>', <%= lowerCamel %>);<% } else { %>
<% if (passFunc) { %>  <% } %>  .filter('<%= lowerCamel %>', function <% if (namedFunc) { %><%= lowerCamel %><% } %>() {
<% if (passFunc) { %>  <% } %>    return function (input) {
<% if (passFunc) { %>  <% } %>      var temp = [];
<% if (passFunc) { %>  <% } %>      angular.forEach(input, function (item) {
<% if (passFunc) { %>  <% } %>        if(item > 3) {
<% if (passFunc) { %>  <% } %>          temp.push(item);
<% if (passFunc) { %>  <% } %>        }
<% if (passFunc) { %>  <% } %>      });
<% if (passFunc) { %>  <% } %>      return temp;
<% if (passFunc) { %>  <% } %>    };
<% if (passFunc) { %>  <% } %>  });<% } %>
<% if (passFunc) { %>
})();<% } %>
