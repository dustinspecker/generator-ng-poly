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
  modulePath = modulePath.replace(/[\\\/]/g, path.sep);
  modulePath = modulePath.split(path.sep).map(hyphenName).join(path.sep);

  return modulePath;
}

function moduleExists(yoRcAbsolutePath, modulePath) {
  // check if file exists
  var yoPath = path.dirname(yoRcAbsolutePath)
    , fullPath = path.join(yoPath, 'app', normalizeModulePath(modulePath));

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
    , angularDefinitionCloseLine = -1;

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
    lines[angularDefinitionCloseLine-1] = lines[angularDefinitionCloseLine-1].slice(0, lines[angularDefinitionCloseLine-1].lastIndexOf('\''));
    lines[angularDefinitionCloseLine-1] = lines[angularDefinitionCloseLine-1] + '\',';
  }

  // insert new line and dependency
  lines.splice(angularDefinitionCloseLine, 0, '    \'' + dependency + '\'');

  return lines.join(endOfLine);
}

function addRoute(fileContents, state, config) {
  var dependency = config.ngRoute ? 'ngRoute' : 'ui.router';
  var param = config.ngRoute ? 'routeProvider' : 'stateProvider';
  var newRoute = config.ngRoute ? 'when' : 'state';

  // if file doesn't have the dependency, add it
  if (!dependencyExists(fileContents, dependency)) {
    fileContents = addDependency(fileContents, dependency);
  }

  // check if provider is passed to config
  var regex = new RegExp('function.*\\(.*\\$' + param + '.*\\)');
  var addParam = !regex.test(fileContents);

  // find line to add new state
  var lines = fileContents.split(endOfLine)
    , routeStartIndex = -1
    , routeEndIndex = -1
    , braceCount = 0 // {}
    , configFunctionIndex = -1;
  lines.forEach(function (line, i) {
    // add $stateProvider if needed
    if ( (addParam && config.passFunc && line.indexOf('function config(') > -1) ||
      (addParam && !config.passFunc && line.indexOf('.config(function') > -1) ) {
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

  var newState;

  // base route logic
  if (config.ngRoute) {
    newState = [
      '    .when(\'' + state.url + '\', {',
      '      templateUrl: \'' + state.templateUrl + '\','
    ];
  } else {
    newState = [
      '    .state(\'' + state.lowerCamel + '\', {',
      '      url: \'' + state.url + '\',',
      '      templateUrl: \'' + state.templateUrl + '\','
    ];
  }

  // controller as logic
  if (config.controllerAs && config.ngRoute) {
    newState.push('      controller: \'' + state.ctrlName + '\',');
    newState.push('      controllerAs: \'' + state.lowerCamel + '\'');
  } else if (config.controllerAs && !config.ngRoute) {
    newState.push('      controller: \'' + state.ctrlName + ' as ' + state.lowerCamel + '\'');
  } else {
    newState.push('      controller: \'' + state.ctrlName + '\'');
  }

  if (routeStartIndex > -1) {
    // add cloasing to squeeze new state between existing route and the final });
    newState.unshift('    })');
  } else {
    // add provider
    if (config.ngRoute) {
      newState.unshift('  $routeProvider'); 
    } else {
      newState.unshift('  $stateProvider');
    }

    // close up this new state, which is the first state
    newState.push('    });');
  }

  // prepend spaces if not passsing the function
  if (!config.passFunc) {
    newState = newState.map(function (newStateLine) {
      return '  ' + newStateLine;
    });
  }

  // insert the ilne after last existing state or at the start of the config function
  var insertLine = (routeStartIndex > -1) ? routeEndIndex : configFunctionIndex + 1;

  lines.splice(insertLine, 0, newState.map(function (newStateLine) {
    return newStateLine;
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
  normalizeModulePath: normalizeModulePath,
  moduleExists: moduleExists,
  extractModuleNames: extractModuleNames,
  addRoute: addRoute,
  dependencyExists: dependencyExists,
  addDependency: addDependency,
  checkElementName: checkElementName
};
