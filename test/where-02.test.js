var obop = require('../');
var sample3 = require('./data/sample3.json');
var assert = require('chai').assert;

describe('where-02', function() {
  describe('sample3', tests(sample3));
});

function wheretest(sample, where, tester, mess) {
  mess = mess || JSON.stringify(where);
  it(mess, function(done) {
    var selector = obop.where(where);
    assert.notOk(selector instanceof Error, 'where() should not return an error: ' + selector);
    if (tester) {
      assert.equal(typeof selector, 'function', 'selector should be a function');
      var actual = clone(sample).filter(selector);
      var expect = clone(sample).filter(tester);
      assert.deepEqual(actual, expect);
    } else {
      assert.notOk(selector, 'selector should be empty');
    }
    done();
  });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function tests(sample) {
  return function() {
    // W041: Use '===' to compare with '0'.
    var zero = 0;
    wheretest(sample, {
      "a": zero
    }, function(item) {
      return item.a == zero;
    });

    wheretest(sample, {
      "a": 1
    }, function(item) {
      return item.a == 1;
    });

    wheretest(sample, {
      "a.b": zero
    }, function(item) {
      var a = item.a || {};
      return a.b == zero;
    });

    wheretest(sample, {
      "a.b": 2
    }, function(item) {
      var a = item.a || {};
      return a.b == 2;
    });

    wheretest(sample, {
      "a.b.c": zero
    }, function(item) {
      var a = item.a || {};
      var b = a.b || {};
      return b.c == zero;
    });

    wheretest(sample, {
      "a.b.c": 3
    }, function(item) {
      var a = item.a || {};
      var b = a.b || {};
      return b.c == 3;
    });

    wheretest(sample, {
      "a.b": 2,
      "a.d": 4
    }, function(item) {
      var a = item.a || {};
      return a.b == 2 && a.d == 4;
    });

    wheretest(sample, {
      "a.b.c": 3,
      "a.b.e": 5
    }, function(item) {
      var a = item.a || {};
      var b = a.b || {};
      return b.c == 3 && b.e == 5;
    });

  };
}
