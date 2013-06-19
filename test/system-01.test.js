var obop = require('../');
var assert = require('chai').assert;

describe('system', function() {
  it('name', function(done) {
    assert.ok(obop.system.name, 'system should have propety: name');
    done();
  });

  it('version', function(done) {
    assert.ok(obop.system.version, 'system should have propety: version');
    done();
  });
});
