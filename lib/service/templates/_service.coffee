'use strict'

###*
 # @ngdoc service
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.service:<%= upperCamel %>

 # @description

###
class <%= upperCamel %>
  constructor: ->
    @name = '<%= upperCamel %>'

  get: ->
    @name

angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .service '<%= upperCamel %>', <%= upperCamel %>
