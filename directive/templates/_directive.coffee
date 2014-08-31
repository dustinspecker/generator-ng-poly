'use strict'

###
 # @ngdoc directive
 # @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.directive:<%= lowerCamel %>
 # @restrict EA
 # @element
 #
 # @description
 # Change the element's text to <%= lowerCamel %>\nscope\nattrs
 #
 # @example
   <example module="<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>">
     <file name="index.html">
      <<%= hyphenName %>></<%= hyphenName %>>
     </file>
   </example>
 #
###

angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'
  .directive '<%= lowerCamel %>', ->
    restrict: 'AE'
    scope: {}
    templateUrl: '<%= modulePath %>/<%= hyphenName %>-directive.tpl.html'
    replace: false
    link: (scope, element, attrs) ->
      element.text '<%= lowerCamel %>\n' + scope + '\n' + attrs
