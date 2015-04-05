'use strict'

###* @ngdoc object
 # @name <%= moduleName %>
 # @description

###
angular
  .module '<%= moduleName %>', [<% if (bower.indexOf('aria') > -1) { %>
    'ngAria',<% } %><% if (framework === 'material' ) { %>
    'ngMaterial',<% } %>
    <% if (ngRoute) { %>'ngRoute'<% } else { %>'ui.router'<% } %><% if (framework === 'angularstrap') { %>,
    'mgcrea.ngStrap'<% } %><% if (framework === 'uibootstrap') { %>,
    'ui.bootstrap'<% } %><% if (framework === 'foundation') { %>,
    'mm.foundation'<% } %>
  ]
