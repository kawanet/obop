var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;

describe('order-01', function() {
  describe('sample1', tests(sample1));
  describe('sample2', tests(sample2));
});

function ordertest(sample, order, tester, mess) {
  mess = mess || JSON.stringify(order);
  it(mess, function(done) {
    var sorter = obop.order(order);
    assert.notOk(sorter instanceof Error, 'order() should not return an error: ' + sorter);
    if (tester) {
      assert.equal(typeof sorter, 'function', 'sorter should be a function');
      var actual = clone(sample).filter(sorter);
      var expect = clone(sample).filter(tester);
      var view = {};
      Object.keys(order).forEach(function(key) {
        view[key] = 1;
      });
      var projection = obop.view(view);
      if (projection) {
        actual = actual.map(projection);
        expect = expect.map(projection);
      }
      assert.deepEqual(actual, expect, mess);
    } else {
      assert.notOk(sorter, 'sorter should be empty');
    }
    done();
  });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function tests(sample) {
  return function() {

    ordertest(sample, {
      name: 1
    }, function(a, b) {
      return ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    ordertest(sample, {
      integral: 1,
      numeric: 1,
      name: 1
    }, function(a, b) {
      return (a.integral - b.integral) || (a.numeric - b.numeric) || ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    ordertest(sample, {
      numeric: 1,
      integral: 1,
      name: 1
    }, function(a, b) {
      return (a.numeric - b.numeric) || (a.integral - b.integral) || ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    ordertest(sample, {
      name: -1
    }, function(a, b) {
      return ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    ordertest(sample, {
      integral: -1,
      numeric: -1,
      name: -1
    }, function(a, b) {
      return (b.integral - a.integral) || (b.numeric - a.numeric) || ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    ordertest(sample, {
      numeric: -1,
      integral: -1,
      name: -1
    }, function(a, b) {
      return (b.numeric - a.numeric) || (b.integral - a.integral) || ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    ordertest(sample, null, null);

    ordertest(sample, {}, null);

    it('[Function]', function(done) {
      var expect = function() {};
      var actual = obop.order(expect);
      assert.equal(typeof actual, 'function', 'should return a function');
      assert.equal(actual, expect, 'should through function');
      done();
    });
  };
}
