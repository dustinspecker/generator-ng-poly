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

function addRoute(fileContents, state, controllerAs, passFunc) {
  // if file doesn't have ui.router as a dependency, add it
  if (!dependencyExists(fileContents, 'ui.router')) {
    fileContents = addDependency(fileContents, 'ui.router');
  }

  // check if $stateProvider is passed to config
  var regex = /function.*\(.*\$stateProvider.*\)/;
  var addStateProvider = !regex.test(fileContents);

  // find line to add new state
  var lines = fileContents.split(endOfLine)
    , stateStartIndex = -1
    , stateEndIndex = -1
    , braceCount = 0 // {}
    , configFunctionIndex = -1;
  lines.forEach(function (line, i) {
    // add $stateProvider if needed
    if ( (addStateProvider && passFunc && line.indexOf('function config(') > -1) ||
      (addStateProvider && !passFunc && line.indexOf('.config(function') > -1) ) {
        // check if function has a parameter already
        if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + '$stateProvider) {';
        } else {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + ', $stateProvider) {';
        }
    }

    if (line.indexOf('function config(') > -1 || line.indexOf('.config(function') > -1) {
      configFunctionIndex = i;
    }

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

  // has existing state
  var newState;
  if (stateStartIndex > -1) {
    // create new state
    newState = [
      '    })',
      '    .state(\'' + state.lowerCamel + '\', {',
      '      url: \'' + state.url + '\',',
      '      templateUrl: \'' + state.templateUrl + '\','
    ];

    if (controllerAs) {
      newState.push('      controller: \'' + state.ctrlName + ' as ' + state.lowerCamel + '\'');
    } else {
      newState.push('      controller: \'' + state.ctrlName + '\'');
    }

    // prepend another two spaces to each line if not passing functions
    if (!passFunc) {
      newState = newState.map(function (newStateLine) {
        return '  ' + newStateLine;
      });
    }

    // join the state
    // insert state above }); of the original last state
    lines.splice(stateEndIndex, 0, newState.map(function (newStateLine) {
      return newStateLine;
    }).join(endOfLine));
  } else {
    // no existing state
    newState = [
      '  $stateProvider',
      '    .state(\'' + state.lowerCamel + '\', {',
      '      url: \'' + state.url + '\',',
      '      templateUrl: \'' + state.module + '/' + state.hyphenName + '.tpl.html\',',
    ];

    // add controller
    if (controllerAs) {
      newState.push('      controller: \'' + state.ctrlName + ' as ' + state.lowerCamel + '\'');
    } else {
      newState.push('      controller: \'' + state.ctrlName + '\'');
    }

    // close state
    newState.push('    });');

    // prepend another two spaces to each line if not passing functions
    if (!passFunc) {
      newState = newState.map(function (newStateLine) {
        return '  ' + newStateLine;
      });
    }

    // insert the first state at top of config function
    lines.splice(configFunctionIndex+1, 0, newState.map(function (newStateLine) {
      return newStateLine;
    }).join(endOfLine));
  }

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
  dependencyExists: dependencyExists,
  addDependency: addDependency,
  checkElementName: checkElementName
};
