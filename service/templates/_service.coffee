'use strict'

###
 # @ngdoc service
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.service:<%= upperCamel %>
 #
 # @description
 #
 #
###

angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .service '<%= upperCamel %>', ->
    class <%= upperCamel %>Base
      get: ->
        '<%= upperCamel %>'

    new <%= upperCamel %>Base()
