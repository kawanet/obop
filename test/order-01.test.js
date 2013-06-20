var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;
var common = require('./common');

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_order;
  describe(prefix + 'order-01', function() {
    describe('sample1', tests(checker, sample1));
    describe('sample2', tests(checker, sample2));
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports();
}

function tests(checker, sample) {
  return function() {

    checker(sample, {
      name: 1
    }, function(a, b) {
      return ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    checker(sample, {
      integral: 1,
      numeric: 1,
      name: 1
    }, function(a, b) {
      return (a.integral - b.integral) || (a.numeric - b.numeric) || ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    checker(sample, {
      numeric: 1,
      integral: 1,
      name: 1
    }, function(a, b) {
      return (a.numeric - b.numeric) || (a.integral - b.integral) || ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    checker(sample, {
      name: -1
    }, function(a, b) {
      return ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    checker(sample, {
      integral: -1,
      numeric: -1,
      name: -1
    }, function(a, b) {
      return (b.integral - a.integral) || (b.numeric - a.numeric) || ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    checker(sample, {
      numeric: -1,
      integral: -1,
      name: -1
    }, function(a, b) {
      return (b.numeric - a.numeric) || (b.integral - a.integral) || ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    checker(sample, null, null);

    checker(sample, {}, null);

    it('[Function]', function(done) {
      var expect = function() {};
      var actual = obop.order(expect);
      assert.equal(typeof actual, 'function', 'should return a function');
      assert.equal(actual, expect, 'should through function');
      done();
    });
  };
}
