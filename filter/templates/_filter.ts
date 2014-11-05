///<reference path='<%= referencePath %>/references.d.ts' />

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
  .filter('<%= lowerCamel %>', <%= lowerCamel %>.filter);

  class <%= lowerCamel %> {
    static filter(input: string) {
      return input;
    }
  }
