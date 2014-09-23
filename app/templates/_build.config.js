'use strict';

module.exports = {
  host: '<%= host %>',
  port: <%= port %>,

  // build directories
  buildDir: 'build/',<% if (polymer) { %>
  buildComponents: 'build/components/',<% } %>
  buildCss: 'build/css/',
  buildFonts: 'build/fonts/',
  buildImages: 'build/images/',
  buildJs: 'build/js/'
};

