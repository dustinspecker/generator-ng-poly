///<reference path='<%= referencePath %>/references.d.ts' />

'use strict';

/**
 * @ngdoc service
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.provider:<%= upperCamel %>
 *
 * @description
 *
 */
angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .provider('<%= upperCamel %>', <%= upperCamel %>);

  class <%= upperCamel %> {
    public static $inject = [
    ];

    constructor() {

    }

    $get() {
      return '<%= upperCamel %>';
    }
  }
