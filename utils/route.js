'use strict';
var endOfLine = require('os').EOL
  , exports = module.exports
  , ngAddDep = require('ng-add-dep');

/**
 * Returns the number of spaces at beginning of a line
 * @param {String} line
 * @return {Number}
 */
function numOfSpacesAtStart(line) {
  return line.substring(0, line.search(/[^ ]/)).length;
}

/**
 * Returns whether the module's config function is injecting parameter
 * @param {String} fileContents
 * @param {String} param
 * @param {Object} config
 * @return {Boolean}
 */
function hasParam(fileContents, config) {
  var param = config.ngRoute ? 'routeProvider' : 'stateProvider'
    , regex; // regex to test

  if (config.appScript === 'ts' || config.appScript === 'js') {
    regex = new RegExp('function.*\\(.*\\$' + param + '.*\\)');
  } else {
    regex = new RegExp('\\(.*\\$' + param + '.*\\) ->');
  }

  return regex.test(fileContents);
}

/**
 * Injects the parameter into the module's config function
 * @param {Array} lines
 * @param {String} param
 * @param {Object} config
 * @return {Array}
 */
function addParam(lines, config) {
  var param = config.ngRoute ? 'routeProvider' : 'stateProvider'
    , type = config.ngRoute ? 'ng.route.IRouteProvider' : 'ng.ui.IStateProvider';

  lines.forEach(function (line, i) {
    if (config.appScript === 'ts') {
      if ((config.passFunc && line.indexOf('function config(') > -1) ||
        (!config.passFunc && line.indexOf('.config(function') > -1)) {
        // check if function has a parameter already
        if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + '$' + param + ': ' + type + ') {';
        } else {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + ', $' + param + ': ' + type + ') {';
        }
      }
    } else if (config.appScript === 'js') {
      if ((config.passFunc && line.indexOf('function config(') > -1) ||
        (!config.passFunc && line.indexOf('.config(function') > -1)) {
        // check if function has a parameter already
        if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + '$' + param + ') {';
        } else {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + ', $' + param + ') {';
        }
      }
    } else {
      if (line.indexOf('.config') > -1 && line.indexOf('->') > -1) {
        // check if function has a parameter already
        if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + '$' + param + ') ->';
        } else if (line.lastIndexOf('(') === -1 && line.lastIndexOf(')') === -1) {
          lines[i] = lines[i].slice(0, line.lastIndexOf('g')) + 'g ($' + param + ') ->';
        } else {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + ', $' + param + ') ->';
        }
      }
    }
  });

  return lines;
}

/**
 * Analyzes lines to determine where to insert new route
 * @param {Array} lines
 * @param {Object} config
 * @return {Object}
 */
function analyzeLines(lines, config) {
  var analysis = {
      routeStartIndex: -1,
      routeEndIndex: -1,
      configFunctionIndex: -1
    }
    , braceCount = 0
    , newRoute = config.ngRoute ? 'when' : 'state';

  lines.forEach(function (line, i) {
    if (config.appScript === 'ts') {
      if (line.indexOf('function config(') > -1 || line.indexOf('.config(function') > -1) {
        analysis.configFunctionIndex = i;
      }

      // look for .state and set routeStartIndex
      if (line.indexOf('.' + newRoute + '(') > -1) {
        analysis.routeStartIndex = i;
      }

      // open braces add to braceCount
      if (analysis.routeStartIndex > -1 && line.indexOf('{') > -1) {
        braceCount++;
      }

      // close braces subract from braceCount
      if (analysis.routeStartIndex > -1 && line.indexOf('}') > -1) {
        braceCount--;
      }

      // when braceCount = 0 the end of the state has been reached
      // set routeEndIndex
      if (analysis.routeStartIndex > -1 && braceCount === 0) {
        analysis.routeEndIndex = i;
      }
    } else if (config.appScript === 'js') {
      if (line.indexOf('function config(') > -1 || line.indexOf('.config(function') > -1) {
        analysis.configFunctionIndex = i;
      }

      // look for .state and set routeStartIndex
      if (line.indexOf('.' + newRoute + '(') > -1) {
        analysis.routeStartIndex = i;
      }

      // open braces add to braceCount
      if (analysis.routeStartIndex > -1 && line.indexOf('{') > -1) {
        braceCount++;
      }

      // close braces subract from braceCount
      if (analysis.routeStartIndex > -1 && line.indexOf('}') > -1) {
        braceCount--;
      }

      // when braceCount = 0 the end of the state has been reached
      // set routeEndIndex
      if (analysis.routeStartIndex > -1 && braceCount === 0) {
        analysis.routeEndIndex = i;
      }
    } else {
      if (line.indexOf('.config') > -1 && line.indexOf('->') > -1) {
        analysis.configFunctionIndex = i;
      }

      // look for .state and set routeStartIndex
      if (line.indexOf('.' + newRoute) > -1) {
        analysis.routeStartIndex = i;
      }
    }
  });

  return analysis;
}

/**
 * Returns new state to add
 * @param {Object} state
 * @param {Object} analysis
 * @param {Object} config
 * @return {Array}
 */
function prepareState(state, analysis, config) {
  var newState = [];

  if (analysis.routeStartIndex === -1) {
    // add provider
    if (config.ngRoute) {
      newState.push('$routeProvider');
    } else {
      newState.push('$stateProvider');
    }
  }

  if (config.appScript === 'ts' || config.appScript === 'js') {
    // base route logic
    if (config.ngRoute) {
      newState.push('  .when(\'' + state.url + '\', {');
    } else {
      newState.push('  .state(\'' + state.name + '\', {');
      newState.push('    url: \'' + state.url + '\',');
    }
    newState.push('    templateUrl: \'' + state.templateUrl + '\'' + (config.skipController ? '' : ','));

    if (!config.skipController) {
      newState.push('    controller: \'' + state.ctrlName + '\'' + (config.controllerAs ? ',' : ''));
      if (config.controllerAs) {
        newState.push('    controllerAs: \'' + state.lowerCamel + '\'');
      }
    }

    if (analysis.routeStartIndex > -1) {
      // add closing to squeeze new state between existing route and the final });
      newState.unshift('  })');
    } else {
      // close up this new state, which is the first state
      newState.push('  });');
    }
  } else {
    // base route logic
    if (config.ngRoute) {
      newState.push('  .when \'' + state.url + '\',');
    } else {
      newState.push('  .state \'' + state.name + '\',');
      newState.push('    url: \'' + state.url + '\'');
    }
    newState.push('    templateUrl: \'' + state.templateUrl + '\'');

    if (!config.skipController) {
      newState.push('    controller: \'' + state.ctrlName + '\'');
      if (config.controllerAs) {
        newState.push('    controllerAs: \'' + state.lowerCamel + '\'');
      }
    }
  }

  return newState;
}

/**
 * Adds state to lines
 * @param {Array} lines
 * @param {Object} state
 * @param {Object} analysis
 * @param {Object} config
 * @return {Array}
 */
function addState(lines, state, analysis, config) {
  var insertLine, lineToCheck, numOfSpaces, numOfSpacesCounter;

  // count spaces to prepend to state
  if (analysis.routeStartIndex > -1) {
    lineToCheck = lines[analysis.routeStartIndex];
  } else {
    lineToCheck = lines[analysis.configFunctionIndex];
  }

  numOfSpaces = numOfSpacesAtStart(lineToCheck);

  // if this is the first state, add 2 more spaces to indent inside config function
  // else remove 2 spaces to line up with existing states
  if (analysis.routeStartIndex === -1) {
    numOfSpaces += 2;
  } else {
    numOfSpaces -= 2;
  }

  // prepend spaces
  state = state.map(function (stateLine) {
    for (var i = 0; i < numOfSpaces; i++) {
      stateLine = ' ' + stateLine;
    }
    return stateLine;
  });

  if (config.appScript === 'ts') {
    insertLine = (analysis.routeStartIndex > -1) ? analysis.routeEndIndex : analysis.configFunctionIndex + 1;
  } else if (config.appScript === 'js') {
    insertLine = (analysis.routeStartIndex > -1) ? analysis.routeEndIndex : analysis.configFunctionIndex + 1;
  } else {
    if (analysis.routeStartIndex > -1) {
      // determine where last state ends by examining spaces
      // insert new route on first line to have less spaces at the start
      numOfSpaces = numOfSpacesAtStart(lines[analysis.routeStartIndex]);
      numOfSpacesCounter = numOfSpaces;
      insertLine = analysis.routeStartIndex;
      while (numOfSpacesCounter >= numOfSpaces) {
        insertLine++;
        numOfSpacesCounter = numOfSpacesAtStart(lines[insertLine]);
      }
    } else {
      insertLine = analysis.configFunctionIndex + 1;
    }
  }

  lines.splice(insertLine, 0, state.map(function (stateLine) {
    return stateLine;
  }).join(endOfLine));

  return lines.join(endOfLine);
}

/**
 * Adds route to module's config
 * @param {String} fileContents
 * @param {Object} state
 * @param {Object} config
 * @return {String}
 */
exports.addRoute = function addRoute(fileContents, state, config) {
  var dependency = config.ngRoute ? 'ngRoute' : 'ui.router'

    , needsParam = !hasParam(fileContents, config) // checking if provider is used

    , lines // split fileContents

    , analysis // new state insertion info
    , newState;

  // if file doesn't have the dependency, add it
  fileContents = ngAddDep(fileContents, dependency);

  lines = fileContents.split(endOfLine);
  analysis = analyzeLines(lines, config);

  // if file needs parameter, add it
  if (needsParam) {
    lines = addParam(lines, config);
  }

  newState = prepareState(state, analysis, config);

  return addState(lines, newState, analysis, config);
};
