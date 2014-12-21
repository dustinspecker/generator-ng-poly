///<reference path='<%= referencePath %>' />
module <%= upperCamel %> {
  'use strict';

  class <%= upperCamel %> {
    constructor() {
    }

    $get() {
      return '<%= upperCamel %>';
    }
  }

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
}
