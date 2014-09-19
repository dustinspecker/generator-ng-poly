'use strict';
var _ = require('lodash')
  , elementUtils = require('./element')
  , moduleUtils = require('./module')
  , nameUtils = require('./name')
  , routeUtils = require('./route');

_.assign(module.exports, elementUtils);
_.assign(module.exports, moduleUtils);
_.assign(module.exports, nameUtils);
_.assign(module.exports, routeUtils);
