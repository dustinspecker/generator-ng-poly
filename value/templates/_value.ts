///<reference path='<%= referencePath %>' />
module <%= lowerCamel %> {
  'use strict';

  /**
  * @ngdoc service
  * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.constant:<%= lowerCamel %>
  *
  * @description
  *
  */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .value('<%= lowerCamel %>', 0);

}
