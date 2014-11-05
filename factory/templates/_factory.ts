///<reference path='<%= referencePath %>/references.d.ts' />

'use strict';

/**
 * @ngdoc service
 * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.factory:<%= upperCamel %>
 *
 * @description
 *
 */
angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
  .factory('<%= upperCamel %>', <%= upperCamel %>);

  class <%= upperCamel %> {
    public static $inject = [
    ];

    private logGreeting(greeting: string) {
      console.log("Received greeting: " + greeting);
    }

    getGreeting(greeting) {
      this.logGreeting(greeting);
      return "greeting " + greeting;
    }
  }
