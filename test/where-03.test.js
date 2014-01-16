var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var sample3 = require('./data/sample3.json');
var common = require('./common');

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_where;
  describe(prefix + 'where-03', function() {
    describe('sample1', tests1(checker, sample1));
    describe('sample2', tests2(checker, sample2));
    describe('sample3', tests3(checker, sample3));
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports();
}

function tests1(checker, sample) {
  return function() {

    checker(sample, {
      "integral": {
        $gt: 2000
      }
    }, function(item) {
      return item.integral > 2000;
    });

    checker(sample, {
      "integral": {
        $gte: 4567
      }
    }, function(item) {
      return item.integral >= 4567;
    });

    checker(sample, {
      "numeric": {
        $lt: 30
      }
    }, function(item) {
      return item.numeric < 30;
    });

    checker(sample, {
      "numeric": {
        $lte: 22.22
      }
    }, function(item) {
      return item.numeric <= 22.22;
    });

    checker(sample, {
      "name": {
        $ne: "juliet"
      }
    }, function(item) {
      return item.name != "juliet";
    });

    checker(sample, {
      "integral": {
        $in: [2345, 4567]
      }
    }, function(item) {
      return item.integral == 2345 || item.integral == 4567;
    });

    checker(sample, {
      "integral": {
        $in: null
      }
    }, new Error("invalid query"));

    checker(sample, {
      "integral": {
        $nin: [1234, 5678]
      }
    }, function(item) {
      return item.integral != 1234 && item.integral != 5678;
    });

    checker(sample, {
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

    checker(sample, {
      $or: [],
    }, new Error("$or requires nonempty array"));

    checker(sample, {
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

    checker(sample, {
      $and: [],
    }, new Error("$and expression must be a nonempty array"));

    checker(sample, {
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

function tests2(checker, sample) {
  return function() {

    checker(sample, {
      "arr": {
        $size: 0
      }
    }, function(item) {
      if (!item) return false;
      if ('undefined' == typeof item.arr) return false;
      if (!(item.arr instanceof Array)) return false;
      return !item.arr.length;
    });

    checker(sample, {
      "arr": {
        $size: 1
      }
    }, function(item) {
      if (!item) return false;
      if ('undefined' == typeof item.arr) return false;
      if (!(item.arr instanceof Array)) return false;
      return item.arr.length == 1;
    });

    checker(sample, {
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

function tests3(checker, sample) {
  return function() {

    checker(sample, {
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

    checker(sample, {
      "a.b": {
        $exists: true
      }
    }, function(item) {
      var a = item.a || {};
      return 'undefined' !== typeof a.b;
    });

    checker(sample, {
      "a.b": {
        $exists: false
      }
    }, function(item) {
      var a = item.a || {};
      return 'undefined' === typeof a.b;
    });
  };
}
