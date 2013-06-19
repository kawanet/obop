var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;

describe('order-01', function() {
  describe('sample1', tests(sample1));
  describe('sample2', tests(sample2));
});

function ordertest(order, tester, mess) {
  mess = mess || JSON.stringify(order);
  it(mess, function(done) {
    var sorter = obop.order(order);
    if (tester) {
      assert.equal(typeof sorter, 'function', 'sorter should be a function');
      var actual = [].concat(sample1).sort(sorter);
      var expect = [].concat(sample1).sort(tester);
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

function tests(sample) {
  return function() {

    ordertest({
      name: 1
    }, function(a, b) {
      return ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    ordertest({
      integral: 1,
      numeric: 1,
      name: 1
    }, function(a, b) {
      return (a.integral - b.integral) || (a.numeric - b.numeric) || ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    ordertest({
      numeric: 1,
      integral: 1,
      name: 1
    }, function(a, b) {
      return (a.numeric - b.numeric) || (a.integral - b.integral) || ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    ordertest({
      name: -1
    }, function(a, b) {
      return ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    ordertest({
      integral: -1,
      numeric: -1,
      name: -1
    }, function(a, b) {
      return (b.integral - a.integral) || (b.numeric - a.numeric) || ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    ordertest({
      numeric: -1,
      integral: -1,
      name: -1
    }, function(a, b) {
      return (b.numeric - a.numeric) || (b.integral - a.integral) || ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    ordertest(null, null);

    ordertest({}, null);

    it('[Function]', function(done) {
      var expect = function() {};
      var actual = obop.order(expect);
      assert.equal(typeof actual, 'function', 'should return a function');
      assert.equal(actual, expect, 'should through function');
      done();
    });
  };
}
