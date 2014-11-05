///<reference path='<%= referencePath %>/references.d.ts' />

'use strict';

/**
 * @ngdoc service
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.service:<%= upperCamel %>
 *
 * @description
 *
 */
angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .service('<%= upperCamel %>', <%= upperCamel %>);

  class <%= upperCamel %> {
    public static $inject = [
    ];

    constructor() {

    }

    get(): string {
      return '<%= upperCamel %>';
    }
  }
