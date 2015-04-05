'use strict'

angular
  .module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= lowerCamel %>'
  .config ->
