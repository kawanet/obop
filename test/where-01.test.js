var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;

describe('where-01', function() {
  describe('sample1', tests(sample1));
  describe('sample2', tests(sample2));
});

function wheretest(where, tester, mess) {
  mess = mess || JSON.stringify(where);
  it(mess, function(done) {
    var selector = obop.where(where);
    if (tester) {
      assert.equal(typeof selector, 'function', 'selector should be a function');
      var actual = [].concat(sample1).filter(selector);
      var expect = [].concat(sample1).filter(tester);
      assert.deepEqual(actual, expect);
    } else {
      assert.notOk(selector, 'selector should be empty');
    }
    done();
  });
}

function tests(sample) {
  return function() {

    wheretest({
      "name": "alpha"
    }, function(item) {
      return item.name == 'alpha';
    });

    wheretest({
      "integral": 2345
    }, function(item) {
      return item.integral == 2345;
    });

    wheretest({
      "integral": "3456"
    }, function(item) {
      return item.integral == "3456";
    });
    wheretest({
      "numeric": 11.11
    }, function(item) {
      return item.numeric == 11.11;
    });

    wheretest({
      "numeric": "33.33"
    }, function(item) {
      return item.numeric == "33.33";
    });

    wheretest({
      "integral": 1234,
      "numeric": 11.11
    }, function(item) {
      return item.integral == 1234 && item.numeric == 11.11;
    });

    wheretest({
      "integral": "5678",
      "numeric": "22.22"
    }, function(item) {
      return item.integral == "5678" && item.numeric == "22.22";
    });

    wheretest({
      "name": "juliet",
      "integral": 1234,
      "numeric": 11.11
    }, function(item) {
      return item.name == "juliet" && item.integral == 1234 && item.numeric == 11.11;
    });

    wheretest(null, null);

    wheretest({}, null);

    wheretest(india, india, '[Function]');
  };
}

function india(item) {
  return item.name == 'india';
}
