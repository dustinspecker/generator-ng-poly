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
<% } %>angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .filter('<%= lowerCamel %>', <%= lowerCamel %>);<% } else { %>
  .filter('<%= lowerCamel %>', function <% if (namedFunc) { %><%= lowerCamel %><% } %>() {
    return function (input) {
      var temp = [];
      angular.forEach(input, function (item) {
        if(item > 3) {
          temp.push(item);
        }
      });
      return temp;
    };
  });<% } %>
<% if (passFunc) { %>
})();<% } %>