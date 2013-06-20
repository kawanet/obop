var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;

describe('where-01', function() {
  describe('sample1', tests(sample1));
  describe('sample2', tests(sample2));
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

    wheretest(sample, {
      "name": "alpha"
    }, function(item) {
      return item.name == 'alpha';
    });

    wheretest(sample, {
      "integral": 2345
    }, function(item) {
      return item.integral == 2345;
    });

    wheretest(sample, {
      "integral": "3456"
    }, function(item) {
      return item.integral == "3456";
    });
    wheretest(sample, {
      "numeric": 11.11
    }, function(item) {
      return item.numeric == 11.11;
    });

    wheretest(sample, {
      "numeric": "33.33"
    }, function(item) {
      return item.numeric == "33.33";
    });

    wheretest(sample, {
      "integral": 1234,
      "numeric": 11.11
    }, function(item) {
      return item.integral == 1234 && item.numeric == 11.11;
    });

    wheretest(sample, {
      "integral": "5678",
      "numeric": "22.22"
    }, function(item) {
      return item.integral == "5678" && item.numeric == "22.22";
    });

    wheretest(sample, {
      "name": "juliet",
      "integral": 1234,
      "numeric": 11.11
    }, function(item) {
      return item.name == "juliet" && item.integral == 1234 && item.numeric == 11.11;
    });

    wheretest(sample, null, null);

    wheretest(sample, {}, null);

    wheretest(sample, india, india, '[Function]');
  };
}

function india(item) {
  return item.name == 'india';
}
