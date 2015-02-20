'use strict'

###
 # @ngdoc service
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.service:<%= upperCamel %>
 #
 # @description
 #
###
<% if (classes) { %>
class <%= upperCamel %>
  constructor: ->
    @name = '<%= upperCamel %>'

  get: ->
    @name

angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .service '<%= upperCamel %>', [<%= upperCamel %>]
<% } else { %>
    self = @

    self.get = ->
      '<%= upperCamel %>'
    return
<% } %>
