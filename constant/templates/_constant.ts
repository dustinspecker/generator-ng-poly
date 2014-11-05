///<reference path='<%= referencePath %>/references.d.ts' />

'use strict';

/**
 * @ngdoc service
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.constant:<%= upperCamel %>
 *
 * @description
 *
 */
angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .constant('<%= upperCamel %>', 0);
