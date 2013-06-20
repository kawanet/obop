var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var common = require('./common');

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_where;
  describe(prefix + 'where-01', function() {
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
      "name": "alpha"
    }, function(item) {
      return item.name == 'alpha';
    });

    checker(sample, {
      "integral": 2345
    }, function(item) {
      return item.integral == 2345;
    });

    checker(sample, {
      "numeric": 11.11
    }, function(item) {
      return item.numeric == 11.11;
    });

    checker(sample, {
      "integral": 1234,
      "numeric": 11.11
    }, function(item) {
      return item.integral == 1234 && item.numeric == 11.11;
    });

    checker(sample, {
      "name": "juliet",
      "integral": 1234,
      "numeric": 11.11
    }, function(item) {
      return item.name == "juliet" && item.integral == 1234 && item.numeric == 11.11;
    });

    checker(sample, null, null);

    checker(sample, {}, null);
  };
}
