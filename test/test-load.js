/*global describe, beforeEach, it*/
'use strict';
var assert = require('assert');

describe('ng-poly generator', function () {
  it('can be imported without blowing up', function () {
    assert(require('../app') !== undefined);
    assert(require('../constant') !== undefined);
    assert(require('../controller') !== undefined);
    assert(require('../directive') !== undefined);
    assert(require('../element') !== undefined);
    assert(require('../factory') !== undefined);
    assert(require('../provider') !== undefined);
    assert(require('../route') !== undefined);
    assert(require('../service') !== undefined);
    assert(require('../value') !== undefined);
    assert(require('../view') !== undefined);
  });
});
