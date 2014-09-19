'use strict';

module.exports = {
  host: 'localhost',
  port: 3000,

  // build directories
  buildDir: 'build/',<% if (polymer) { %>
  buildComponents: 'build/components/',<% } %>
  buildCss: 'build/css/',
  buildFonts: 'build/fonts/',
  buildImages: 'build/images/',
  buildJs: 'build/js/'
};

