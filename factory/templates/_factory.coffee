'use strict'

###*
 # @ngdoc service
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.factory:<%= upperCamel %>

 # @description

###
<% if (classes) { %>
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
<% } else { %>
angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .factory '<%= upperCamel %>', ->
    <%= upperCamel %>Base = {}
    <%= upperCamel %>Base.someValue = '<%= upperCamel %>'
    <%= upperCamel %>Base.someMethod = ->
      '<%= upperCamel %>'

    <%= upperCamel %>Base
<% } %>
