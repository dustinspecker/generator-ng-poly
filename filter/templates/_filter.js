'use strict';<% if (passFunc) { %>

/* @ngInject */
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

angular
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