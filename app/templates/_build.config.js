'use strict';

module.exports = {
  host: '<%= host %>',
  port: <%= port %>,

  // app directories
  appDir: '<%= appDir %>',

  // unit test directories
  unitTestDir: '<%= unitTestDir %>',

  // build directories
  buildDir: 'build/',<% if (polymer) { %>
  buildComponents: 'build/components/',<% } %>
  buildCss: 'build/css/',
  buildFonts: 'build/fonts/',
  buildImages: 'build/images/',
  buildJs: 'build/js/',
  extCss: 'external/css/',
  extFonts: 'external/fonts/',
  extJs: 'external/js/'
};
