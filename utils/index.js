'use strict';
var _ = require('underscore.string')
  , endOfLine = require('os').EOL
  , fs = require('fs')
  , path = require('path');


// name generators
function lowerCamel(name) {
  return _.camelize(_.slugify(_.humanize(name)));
}

function upperCamel(name) {
  return _.classify(_.slugify(_.humanize(name)));
}

function humanName(name) {
  return _.humanize(name);
}

function hyphenName(name) {
  return _.slugify(_.humanize(name));
}

function ctrlName(name) {
  return upperCamel(name) + 'Ctrl';
}

// getters
function getAppName(yoRcAbsolutePath) {
  return require(path.join(path.dirname(yoRcAbsolutePath), 'package.json')).name;
}

function extractBasedOnChar(string, symbol) {
  var modules = [];

  // string after last symbol is module name
  var moduleName = string.slice(string.lastIndexOf(symbol)).replace(symbol, '');
  modules.push(moduleName);

  // determine if user provided more than 1 symbol
  var parentModuleName = string.slice(0, string.lastIndexOf(symbol));
  if (parentModuleName.indexOf(symbol) > -1) {
    parentModuleName = string.slice(parentModuleName.lastIndexOf(symbol), string.lastIndexOf(symbol));
    parentModuleName = parentModuleName.replace(symbol, '');
  }

  modules.push(parentModuleName);

  return modules;
}

function extractModuleNames(string) {
  string = string.replace(/\\/g, '/');
  // uses module syntax
  if (string.indexOf('/') > -1) {
    return extractBasedOnChar(string, '/');
  } else {
    return [string, null];
  }
}

function normalizeModulePath(modulePath) {
  return modulePath.replace(/[.\\]/g, path.sep);
}

function moduleExists(yoRcAbsolutePath, modulePath) {
  // check if file exists
  var yoPath = path.dirname(yoRcAbsolutePath)
    , fullPath = path.join(yoPath, 'app', normalizeModulePath(modulePath));

  return fs.existsSync(fullPath);
}

function addRoute(fileContents, state, controllerAs, passFunc) {
  // find line to add new state
  var lines = fileContents.split(endOfLine)
    , stateStartIndex = -1
    , stateEndIndex = -1
    , braceCount = 0; // {}
  lines.forEach(function (line, i) {
    // look for .state and set stateStartIndex
    if (line.indexOf('.state(') > -1) {
      stateStartIndex = i;
    }

    // open braces add to braceCount
    if (stateStartIndex > -1 && line.indexOf('{') > -1) {
      braceCount++;
    }

    // close braces subract from braceCount
    if (stateStartIndex > -1 && line.indexOf('}') > -1) {
      braceCount--;
    }

    // when braceCount = 0 the end of the state has been reached
    // set stateEndIndex
    if (stateStartIndex > -1 && braceCount === 0) {
      stateEndIndex = i;
    }

    // loop through everything to append new route at the end
  });

  // create new state
  var newState = [
    '    })',
    '    .state(\'' + state.lowerCamel + '\', {',
    '      url: \'' + state.url + '\',',
    '      templateUrl: \'' + state.module + '/' + state.hyphenName + '.tpl.html\','
  ];

  if (controllerAs) {
    newState.push('      controller: \'' + state.ctrlName + ' as ' + state.lowerCamel + '\'');
  } else {
    newState.push('      controller: \'' + state.ctrlName + '\'');
  }

  // prepend another two spaces to each line if not passing functions
  if (passFunc) {
    newState.map(function (line) {
      return '  ' + line;
    });
  }

  // join the state
  // insert state above }); of the original last state
  lines.splice(stateEndIndex, 0, newState.map(function (line) {
    return line;
  }).join(endOfLine));

  return lines.join(endOfLine);
}

function checkElementName(name) {
  if (name.indexOf('-') < 1 || name.indexOf('-') === name.length-1) {
    throw 'Element name must have a hyphen (-) in it.';
  }
}

module.exports = {
  lowerCamel: lowerCamel,
  upperCamel: upperCamel,
  humanName: humanName,
  hyphenName: hyphenName,
  ctrlName: ctrlName,
  getAppName: getAppName,
  moduleExists: moduleExists,
  extractModuleNames: extractModuleNames,
  addRoute: addRoute,
  checkElementName: checkElementName
};
