'use strict';
var _ = require('underscore.string')
  , endOfLine = require('os').EOL
  , findup = require('findup-sync')
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
  var modules = []
    // string after last symbol is module name
    , moduleName = string.slice(string.lastIndexOf(symbol)).replace(symbol, '')
    , parentModuleName;

  modules.push(moduleName);

  // determine if user provided more than 1 symbol
  parentModuleName = string.slice(0, string.lastIndexOf(symbol));
  if (parentModuleName.indexOf(symbol) > -1) {
    parentModuleName = string.slice(parentModuleName.lastIndexOf(symbol), string.lastIndexOf(symbol));
    parentModuleName = parentModuleName.replace(symbol, '');
  }

  modules.push(parentModuleName);

  return modules;
}

function extractModuleNames(string) {
  // return appName for app.js
  if (string === 'app.js') {
    var appName = require(path.join(path.dirname(findup('.yo-rc.json')), 'package.json')).name;
    return [appName, null];
  }

  string = string.replace(/\\/g, '/');
  // uses module syntax
  if (string.indexOf('/') > -1) {
    return extractBasedOnChar(string, '/');
  }

  return [string, null];
}

function normalizeModulePath(modulePath) {
  if (modulePath === 'app.js') {
    return '';
  }

  modulePath = modulePath.replace(/[\\\/]/g, path.sep);
  modulePath = modulePath.split(path.sep).map(hyphenName).join(path.sep);

  return modulePath;
}

function moduleExists(yoRcAbsolutePath, modulePath) {
  // check if file exists
  var yoPath = path.dirname(yoRcAbsolutePath)
    , fullPath;

  if (modulePath === 'app.js') {
    return true;
  }

  fullPath = path.join(yoPath, 'app', normalizeModulePath(modulePath));

  return fs.existsSync(fullPath);
}

function dependencyExists(fileContents, dependency) {
  var regex = new RegExp('[.]module\\(\'[^$]*\', \\[[^$]*\'' + dependency + '\'[^$]*\\]\\);');
  return regex.test(fileContents);
}

function addDependency(fileContents, dependency) {
  // find line to add new dependency
  var lines = fileContents.split(endOfLine)
    , angularDefinitionOpenLine = -1
    , angularDefinitionCloseLine = -1
    , i, numOfSpaces;

  lines.forEach(function (line, i) {
    // find line with angular.module('*', [
    if (angularDefinitionOpenLine < 0 && line.indexOf('.module') > -1) {
      angularDefinitionOpenLine = i;
    }

    // find line with closing ]);
    if (angularDefinitionOpenLine > -1 && angularDefinitionCloseLine < 0 && line.indexOf(']);') > -1) {
      angularDefinitionCloseLine = i;
    }
  });

  // if there is a previous dependency
  // remove new line and add a comma to the previous depdendency
  // slice at the last quote to remove the varying line endings
  if (angularDefinitionCloseLine > angularDefinitionOpenLine + 1) {
    lines[angularDefinitionCloseLine - 1] =
      lines[angularDefinitionCloseLine - 1].slice(0, lines[angularDefinitionCloseLine - 1].lastIndexOf('\''));
    lines[angularDefinitionCloseLine - 1] = lines[angularDefinitionCloseLine - 1] + '\',';
  }

  numOfSpaces = lines[angularDefinitionCloseLine].substring(0, lines[angularDefinitionCloseLine].search(/[^ ]/)).length;

  dependency = '\'' + dependency + '\'';

  for (i = 0; i < numOfSpaces + 2; i++) {
    dependency = ' ' + dependency;
  }

  // insert new line and dependency
  lines.splice(angularDefinitionCloseLine, 0, dependency);

  return lines.join(endOfLine);
}

function addRoute(fileContents, state, config) {
  var dependency = config.ngRoute ? 'ngRoute' : 'ui.router'
    , param = config.ngRoute ? 'routeProvider' : 'stateProvider'
    , newRoute = config.ngRoute ? 'when' : 'state'

    // checking if provider is used
    , regex = new RegExp('function.*\\(.*\\$' + param + '.*\\)')
    , addParam = !regex.test(fileContents)

    // for determining where to place new state
    , routeStartIndex = -1
    , routeEndIndex = -1
    , braceCount = 0 // {}
    , configFunctionIndex = -1

    // for prepending spaces to new route
    , numOfSpaces = 0
    , lineToCheck = null

    , lines // split fileContents

    // new state insertion
    , insertLine
    , newState;

  // if file doesn't have the dependency, add it
  if (!dependencyExists(fileContents, dependency)) {
    fileContents = addDependency(fileContents, dependency);
  }

  lines = fileContents.split(endOfLine);

  // find line to add new state
  lines.forEach(function (line, i) {
    // add $stateProvider if needed
    if ((addParam && config.passFunc && line.indexOf('function config(') > -1) ||
      (addParam && !config.passFunc && line.indexOf('.config(function') > -1)) {
      // check if function has a parameter already
      if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
        lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + '$' + param + ') {';
      } else {
        lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + ', $' + param + ') {';
      }
    }

    if (line.indexOf('function config(') > -1 || line.indexOf('.config(function') > -1) {
      configFunctionIndex = i;
    }

    // look for .state and set routeStartIndex
    if (line.indexOf('.' + newRoute + '(') > -1) {
      routeStartIndex = i;
    }

    // open braces add to braceCount
    if (routeStartIndex > -1 && line.indexOf('{') > -1) {
      braceCount++;
    }

    // close braces subract from braceCount
    if (routeStartIndex > -1 && line.indexOf('}') > -1) {
      braceCount--;
    }

    // when braceCount = 0 the end of the state has been reached
    // set routeEndIndex
    if (routeStartIndex > -1 && braceCount === 0) {
      routeEndIndex = i;
    }

    // loop through everything to append new route at the end
  });

  // base route logic
  if (config.ngRoute) {
    newState = [
      '  .when(\'' + state.url + '\', {',
      '    templateUrl: \'' + state.templateUrl + '\','
    ];
  } else {
    newState = [
      '  .state(\'' + state.lowerCamel + '\', {',
      '    url: \'' + state.url + '\',',
      '    templateUrl: \'' + state.templateUrl + '\','
    ];
  }

  // controller as logic
  if (config.controllerAs && config.ngRoute) {
    newState.push('    controller: \'' + state.ctrlName + '\',');
    newState.push('    controllerAs: \'' + state.lowerCamel + '\'');
  } else if (config.controllerAs && !config.ngRoute) {
    newState.push('    controller: \'' + state.ctrlName + ' as ' + state.lowerCamel + '\'');
  } else {
    newState.push('    controller: \'' + state.ctrlName + '\'');
  }

  if (routeStartIndex > -1) {
    // add cloasing to squeeze new state between existing route and the final });
    newState.unshift('  })');
  } else {
    // add provider
    if (config.ngRoute) {
      newState.unshift('$routeProvider');
    } else {
      newState.unshift('$stateProvider');
    }

    // close up this new state, which is the first state
    newState.push('  });');
  }

  // count spaces to prepend to state
  if (routeStartIndex > -1) {
    lineToCheck = lines[routeStartIndex];
  } else {
    lineToCheck = lines[configFunctionIndex];
  }

  // strip away line after first non space character and count number of spaces left
  numOfSpaces = lineToCheck.substring(0, lineToCheck.search(/[^ ]/)).length;

  // if this is the first state, add 2 more spaces to indent inside config function
  // else remove 2 spaces to line up with existing states
  if (routeStartIndex === -1) {
    numOfSpaces += 2;
  } else {
    numOfSpaces -= 2;
  }

  // prepend spaces
  newState = newState.map(function (newStateLine) {
    for (var i = 0; i < numOfSpaces; i++) {
      newStateLine = ' ' + newStateLine;
    }
    return newStateLine;
  });

  // insert the ilne after last existing state or at the start of the config function
  insertLine = (routeStartIndex > -1) ? routeEndIndex : configFunctionIndex + 1;

  lines.splice(insertLine, 0, newState.map(function (newStateLine) {
    return newStateLine;
  }).join(endOfLine));

  return lines.join(endOfLine);
}

function checkElementName(name) {
  if (name.indexOf('-') < 1 || name.indexOf('-') === name.length - 1) {
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
  normalizeModulePath: normalizeModulePath,
  moduleExists: moduleExists,
  extractModuleNames: extractModuleNames,
  addRoute: addRoute,
  dependencyExists: dependencyExists,
  addDependency: addDependency,
  checkElementName: checkElementName
};
