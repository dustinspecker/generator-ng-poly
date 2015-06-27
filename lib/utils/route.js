'use strict';
import _ from 'lodash';
import {EOL} from 'os';
import fs from 'fs';
import {join} from 'path';

/**
 * Returns the number of spaces at beginning of a line
 * @param {String} line - line to analyze
 * @return {Number} - number of spaces at beginning of line
 */
function numOfSpacesAtStart(line) {
  return line.substring(0, line.search(/[^ ]/)).length;
}

/**
 * Returns whether the module's config function is injecting parameter
 * @param {String} fileContents - file contents of module
 * @param {Object} config - user's config
 * @return {Boolean} - does module have param?
 */
function hasParam(fileContents, config) {
  const param = config.ngRoute ? 'routeProvider' : 'stateProvider';

  // regex to test
  let regex;

  if (config.appScript === 'ts' || config.appScript === 'js' || config.appScript === 'es6') {
    regex = new RegExp('function.*\\(.*\\$' + param + '.*\\)');
  } else {
    regex = new RegExp('\\(.*\\$' + param + '.*\\) ->');
  }

  return regex.test(fileContents);
}

/**
 * Injects the parameter into the module's config function
 * @param {Array} lines - lines to modify
 * @param {Object} config - user's config
 * @return {Array} - modified lines
 */
function addParam(lines, config) {
  const param = config.ngRoute ? 'routeProvider' : 'stateProvider'
    , type = config.ngRoute ? 'ng.route.IRouteProvider' : 'ng.ui.IStateProvider';

  lines.forEach((line, i) => {
    if (config.appScript === 'ts') {
      if (line.indexOf('function config(') > -1) {
        // check if function has a parameter already
        if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + `$${param}: ${type}) {`;
        } else {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + `, $${param}: ${type}) {`;
        }
      }
    } else if (config.appScript === 'js' || config.appScript === 'es6') {
      if (line.indexOf('function config(') > -1) {
        // check if function has a parameter already
        if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + `$${param}) {`;
        } else {
          lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + `, $${param}) {`;
        }
      }
    } else if (line.indexOf('.config') > -1 && line.indexOf('->') > -1) {
      // check if function has a parameter already
      if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
        lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + `$${param}) ->`;
      } else if (line.lastIndexOf('(') === -1 && line.lastIndexOf(')') === -1) {
        lines[i] = lines[i].slice(0, line.lastIndexOf('g')) + `g ($${param}) ->`;
      } else {
        lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + `, $${param}) ->`;
      }
    }
  });

  return lines;
}

/**
 * Analyzes lines to determine where to insert new route
 * @param {Array} lines - lines to analyze
 * @param {Object} config - user's config
 * @return {Object} - info regarding insertion points
 */
function analyzeLines(lines, config) {
  const newRoute = config.ngRoute ? 'when' : 'state';

  let analysis = {
      routeStartIndex: -1,
      routeEndIndex: -1,
      configFunctionIndex: -1
    }
    , braceCount = 0;

  lines.forEach((line, i) => {
    if (config.appScript === 'ts' || config.appScript === 'js' || config.appScript === 'es6') {
      if (line.indexOf('function config(') > -1) {
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
 * @param {Object} state - state info to format
 * @param {Object} analysis - information for insertion
 * @param {Object} config - user's config
 * @return {Array} - lines of new state
 */
function prepareState(state, analysis, config) {
  let context = {}
    , templateFile = '';

  templateFile = join(__dirname, 'templates', `_${(config.ngRoute ? 'ngroute' : 'uirouter')}.`);
  templateFile += (config.appScript === 'coffee' ? 'coffee' : 'js');

  context.analysis = analysis;
  context.config = config;
  context.state = state;

  return _.template(fs.readFileSync(templateFile))(context).split(/\r?\n/);
}

/**
 * Adds state to lines
 * @param {Array} lines - lines to modify with state
 * @param {Object} state - state info to add to lines
 * @param {Object} analysis - insertion info
 * @param {Object} config - user's config
 * @return {Array} - modified lines with added state
 */
function addState(lines, state, analysis, config) {
  let insertLine, lineToCheck, numOfSpaces, numOfSpacesCounter, i;

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
    for (i = 0; i < numOfSpaces; i++) {
      stateLine = ' ' + stateLine;
    }
    return stateLine;
  });

  if (config.appScript === 'ts') {
    insertLine = (analysis.routeStartIndex > -1) ? analysis.routeEndIndex : analysis.configFunctionIndex + 1;
  } else if (config.appScript === 'js' || config.appScript === 'es6') {
    insertLine = (analysis.routeStartIndex > -1) ? analysis.routeEndIndex : analysis.configFunctionIndex + 1;
  } else if (analysis.routeStartIndex > -1) {
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

  lines.splice(insertLine, 0, state.map(function (stateLine) {
    return stateLine;
  }).join(EOL));

  return lines.join(EOL);
}

/**
 * Adds route to module's config
 * @param {String} fileContents - file contents of module
 * @param {Object} state - state info to add
 * @param {Object} config - user's config
 * @return {String} - modified file contents with added state
 */
exports.addRoute = function addRoute(fileContents, state, config) {
  // checking if provider is used
  let needsParam = !hasParam(fileContents, config)

    // split fileContents
    , lines

    // new state insertion info
    , analysis
    , newState;

  lines = fileContents.split(/\r?\n/);
  analysis = analyzeLines(lines, config);

  // if file needs parameter, add it
  if (needsParam) {
    lines = addParam(lines, config);
  }

  newState = prepareState(state, analysis, config);

  return addState(lines, newState, analysis, config);
};
