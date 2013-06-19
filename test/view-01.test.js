var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;

describe('view-01', function() {
  describe('sample1', tests(sample1));
  describe('sample2', tests(sample2));
});

function viewtest(view, tester, mess) {
  mess = mess || JSON.stringify(view);
  it(mess, function(done) {
    var projection = obop.view(view);
    if (tester) {
      assert.equal(typeof projection, 'function', 'projection should be a function');
      var actual = [].concat(sample1).map(projection);
      var expect = [].concat(sample1).map(tester);
      assert.deepEqual(actual, expect, mess);
    } else {
      assert.notOk(projection, 'projection should be empty');
    }
    done();
  });
}

function tests(sample) {
  return function() {

    viewtest({
      name: 1
    }, function(item) {
      return {
        name: item.name
      };
    });

    viewtest({
      integral: 1,
      numeric: 1
    }, function(item) {
      return {
        integral: item.integral,
        numeric: item.numeric
      };
    });

    viewtest({
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

    viewtest({
      name: 0
    }, function(item) {
      return {
        integral: item.integral,
        numeric: item.numeric
      };
    });

    viewtest({
      integral: 0,
      numeric: 0
    }, function(item) {
      return {
        name: item.name
      };
    });

    viewtest({
      name: 0,
      integral: 0,
      numeric: 0
    }, function(item) {
      return {};
    });

    viewtest(null, null);

    viewtest({}, null);

    viewtest(_name, _name, '[Function]');
  };
}

function _name(item) {
  return {
    name: item.name
  };
}
