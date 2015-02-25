'use strict'

###*
 # @ngdoc service
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.factory:<%= upperCamel %>

 # @description

###
class <%= upperCamel %>
  @instance = undefined
  @someValue = '<%= upperCamel %>'
  constructor: ->
    if @instance then @instance else @instance = @

  @someMethod: ->
    '<%= upperCamel %>'

angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .factory '<%= upperCamel %>', [<%= upperCamel %>]
