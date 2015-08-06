(function () {
  'use strict';

  /**
   * @ngdoc filter
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.filter:<%= lowerCamel %>
   *
   * @description
   *
   * @param {Array} input The array to filter
   * @returns {Array} The filtered array
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .filter('<%= lowerCamel %>', <%= lowerCamel %>);

  function <%= lowerCamel %>() {
    return (input) => {
      let temp = [];
      angular.forEach(input, (item) => {
        if (item > 3) {
          temp.push(item);
        }
      });
      return temp;
    };
  }
}());
