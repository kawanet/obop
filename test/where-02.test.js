var sample3 = require('./data/sample3.json');
var common = require('./common');

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_where;
  describe(prefix + 'where-02', function() {
    describe('sample3', tests(checker, sample3));
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports();
}

function tests(checker, sample) {
  return function() {
    // W041: Use '===' to compare with '0'.
    var zero = 0;
    checker(sample, {
      "a": zero
    }, function(item) {
      return item.a == zero;
    });

    checker(sample, {
      "a": 1
    }, function(item) {
      return item.a == 1;
    });

    checker(sample, {
      "a.b": zero
    }, function(item) {
      var a = item.a || {};
      return a.b == zero;
    });

    checker(sample, {
      "a.b": 2
    }, function(item) {
      var a = item.a || {};
      return a.b == 2;
    });

    checker(sample, {
      "a.b.c": zero
    }, function(item) {
      var a = item.a || {};
      var b = a.b || {};
      return b.c == zero;
    });

    checker(sample, {
      "a.b.c": 3
    }, function(item) {
      var a = item.a || {};
      var b = a.b || {};
      return b.c == 3;
    });

    checker(sample, {
      "a.b": 2,
      "a.d": 4
    }, function(item) {
      var a = item.a || {};
      return a.b == 2 && a.d == 4;
    });

    checker(sample, {
      "a.b.c": 3,
      "a.b.e": 5
    }, function(item) {
      var a = item.a || {};
      var b = a.b || {};
      return b.c == 3 && b.e == 5;
    });
  };
}
