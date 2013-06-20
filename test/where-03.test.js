var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var sample3 = require('./data/sample3.json');
var assert = require('chai').assert;

describe('where-03', function() {
  describe('sample1', tests1(sample1));
  describe('sample2', tests2(sample2));
  describe('sample3', tests3(sample3));
});

function wheretest(sample, where, tester, mess) {
  mess = mess || JSON.stringify(where);
  it(mess, function(done) {
    var selector = obop.where(where);
    if (tester) {
      assert.notOk(selector instanceof Error, 'selector should not return an error: ' + selector);
      assert.equal(typeof selector, 'function', 'selector should be a function');
      var actual = [].concat(sample).filter(selector);
      var expect = [].concat(sample).filter(tester);
      assert.deepEqual(actual, expect);
      // console.error(actual.length);
    } else {
      assert.notOk(selector, 'selector should be empty');
    }
    done();
  });
}

function tests1(sample) {
  return function() {

    wheretest(sample, {
      "integral": {
        $gt: 2000
      }
    }, function(item) {
      return item.integral > 2000;
    });

    wheretest(sample, {
      "integral": {
        $gte: 4567
      }
    }, function(item) {
      return item.integral >= 4567;
    });

    wheretest(sample, {
      "numeric": {
        $lt: 30
      }
    }, function(item) {
      return item.numeric < 30;
    });

    wheretest(sample, {
      "numeric": {
        $lte: 22.22
      }
    }, function(item) {
      return item.numeric <= 22.22;
    });

    wheretest(sample, {
      "name": {
        $ne: "juliet"
      }
    }, function(item) {
      return item.name != "juliet";
    });

    wheretest(sample, {
      $or: [{
          integral: {
            $lt: 2000
          }
        }, {
          numeric: {
            $gt: 30.00
          }
        }
      ]
    }, function(item) {
      return item.integral < 2000 || item.numeric > 30;
    });

    wheretest(sample, {
      $and: [{
          integral: {
            $gt: 2000
          }
        }, {
          numeric: {
            $lt: 30.00
          }
        }
      ]
    }, function(item) {
      return item.integral > 2000 && item.numeric < 30;
    });

    wheretest(sample, {
      "integral": {
        $not: {
          $lt: 4000
        }
      }
    }, function(item) {
      var b = (item.integral < 4000);
      return !b;
    });

  };
}

function tests2(sample) {
  return function() {

    wheretest(sample, {
      "arr": {
        $size: 0
      }
    }, function(item) {
      if (!item) return true;
      if ('undefined' == typeof item.arr) return true;
      if (!(item.arr instanceof Array)) return false;
      return !item.arr.length;
    });

    wheretest(sample, {
      "arr": {
        $size: 1
      }
    }, function(item) {
      if (!item) return false;
      if ('undefined' == typeof item.arr) return false;
      if (!(item.arr instanceof Array)) return true;
      return item.arr.length == 1;
    });

    wheretest(sample, {
      "arr": {
        $size: 6
      }
    }, function(item) {
      var arr = item.arr || [];
      if (!(arr instanceof Array)) arr = [arr];
      return arr.length == 6;
    });
  };
}

function tests3(sample) {
  return function() {

    wheretest(sample, {
      "a.b": {
        $not: {
          $gte: 2
        }
      }
    }, function(item) {
      var a = item.a || {};
      var b = (a.b >= 2);
      return !b;
    });

    wheretest(sample, {
      "a.b": {
        $exist: true
      }
    }, function(item) {
      var a = item.a || {};
      return 'undefined' !== typeof a.b;
    });

    wheretest(sample, {
      "a.b": {
        $exist: false
      }
    }, function(item) {
      var a = item.a || {};
      return 'undefined' === typeof a.b;
    });
  };
}
