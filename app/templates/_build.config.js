'use strict';

module.exports = {
  // build directories
  buildDir: 'build/',<% if (polymer) { %>
  buildComponents: 'build/components/',<% } %>
  buildCss: 'build/css/',
  buildFonts: 'build/fonts/',
  buildImages: 'build/images/',
  buildJs: 'build/js/'
};

