///<reference path='<%= referencePath %>' />
module <%= upperCamel %> {
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
    .value('<%= upperCamel %>', 0);

}
