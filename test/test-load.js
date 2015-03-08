/*global describe, it*/
'use strict';
var assert = require('assert');

describe('ng-poly generator', function () {
  it('can be imported without blowing up', function () {
    assert(require('../app'));
    assert(require('../constant'));
    assert(require('../controller'));
    assert(require('../directive'));
    assert(require('../element'));
    assert(require('../factory'));
    assert(require('../filter'));
    assert(require('../genBase'));
    assert(require('../provider'));
    assert(require('../route'));
    assert(require('../service'));
    assert(require('../value'));
    assert(require('../view'));
  });
});
