///<reference path='<%= referencePath %>' />
module <%= upperCamel %> {
  'use strict';

  class <%= upperCamel %> {
    public static $inject: Array<string> = [
    ];

    constructor() {
    }

    get(): string {
      return '<%= upperCamel %>';
    }
  }

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
}
