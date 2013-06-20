var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;

describe('view-01', function() {
  describe('sample1', tests(sample1));
  describe('sample2', tests(sample2));
});

function viewtest(sample, view, tester, mess) {
  mess = mess || JSON.stringify(view);
  it(mess, function(done) {
    var projection = obop.view(view);
    assert.notOk(projection instanceof Error, 'view() should not return an error: ' + projection);
    if (tester) {
      assert.equal(typeof projection, 'function', 'projection should be a function');
      var actual = clone(sample).filter(projection);
      var expect = clone(sample).filter(tester);
      assert.deepEqual(actual, expect, mess);
    } else {
      assert.notOk(projection, 'projection should be empty');
    }
    done();
  });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function tests(sample) {
  return function() {

    viewtest(sample, {
      name: 1
    }, function(item) {
      return {
        name: item.name
      };
    });

    viewtest(sample, {
      integral: 1,
      numeric: 1
    }, function(item) {
      return {
        integral: item.integral,
        numeric: item.numeric
      };
    });

    viewtest(sample, {
      name: 1,
      integral: 1,
      numeric: 1
    }, function(item) {
      return {
        name: item.name,
        integral: item.integral,
        numeric: item.numeric,
      };
    });

    viewtest(sample, {
      name: 0
    }, function(item) {
      return {
        integral: item.integral,
        numeric: item.numeric
      };
    });

    viewtest(sample, {
      integral: 0,
      numeric: 0
    }, function(item) {
      return {
        name: item.name
      };
    });

    viewtest(sample, {
      name: 0,
      integral: 0,
      numeric: 0
    }, function(item) {
      return {};
    });

    viewtest(sample, null, null);

    viewtest(sample, {}, null);

    viewtest(sample, _name, _name, '[Function]');
  };
}

function _name(item) {
  return {
    name: item.name
  };
}
