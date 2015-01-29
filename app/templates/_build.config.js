'use strict';

var outDir = 'build/';

module.exports = {
  host: '<%= host %>',
  port: <%= port %>,

  // app directories
  appDir: '<%= appDir %>',

  // unit test directories
  unitTestDir: '<%= unitTestDir %>',

  // build test dir
  buildTestDir: outDir + 'test/',

  // build directories
  buildDir: outDir + '<%= appDir %>/',<% if (polymer) { %>
  buildComponents: outDir + '<%= appDir %>/components/',<% } %>
  buildCss: outDir + '<%= appDir %>/css/',
  buildFonts: outDir + '<%= appDir %>/fonts/',
  buildImages: outDir + '<%= appDir %>/images/',
  buildJs: outDir + '<%= appDir %>/js/',
  extDir: outDir + '<%= appDir %>/vendor/',
  extCss: outDir + '<%= appDir %>/vendor/css/',
  extFonts: outDir + '<%= appDir %>/vendor/fonts/',
  extJs: outDir + '<%= appDir %>/vendor/js/'
};
