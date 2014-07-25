'use strict';
var endOfLine = require('os').EOL
  , fs = require('fs')
  , join = require('path').join
  , genBase = require('../genBase');


var Generator = module.exports = genBase.extend();

Generator.prototype.prompting = function prompting() {
  this.askForModuleName({url: true});
};

Generator.prototype.writing = function writing() {
  var config = this.getConfig();

  // load app.js to prepare adding new state
  var filePath = join(this.config.path, '../src/', config.modulePath, config.moduleName + '.js')
    , file = fs.readFileSync(filePath, 'utf8');

  // find line to add new state
  var lines = file.split(endOfLine)
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
    '    .state(\'' + config.lowerCamel + '\', {',
    '      url: \'/' + this.url + '\',',
    '      templateUrl: \'' + this.module + '/' + config.hyphenName + '.tpl.html\',',
    '      controller: \'' + config.ctrlName + '\'',
  ];

  // join the state
  // insert state above }); of the original last state
  lines.splice(stateEndIndex, 0, newState.map(function (line) {
    return line;
  }).join(endOfLine));

  // save modifications
  fs.writeFileSync(filePath, lines.join(endOfLine));
};

Generator.prototype.end = function end() {
  this.invoke('ng-poly:controller', {
    args: [this.name],
    options: {
      options: {
        module: this.module
      }
    }
  });
  this.invoke('ng-poly:view', {
    args: [this.name],
    options: {
      options: {
        module: this.module
      }
    }
  });
};