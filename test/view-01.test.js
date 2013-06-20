var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var common = require('./common');

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_view;
  describe(prefix + 'view-01', function() {
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
      name: 1
    }, function(item) {
      var out = {};
      if ('undefined' !== typeof item.name) out.name = item.name;
      return out;
    });

    checker(sample, {
      integral: 1,
      numeric: 1
    }, function(item) {
      var out = {};
      if ('undefined' !== typeof item.integral) out.integral = item.integral;
      if ('undefined' !== typeof item.numeric) out.numeric = item.numeric;
      return out;
    });

    checker(sample, {
      name: 1,
      integral: 1,
      numeric: 1
    }, function(item) {
      var out = {};
      if ('undefined' !== typeof item.name) out.name = item.name;
      if ('undefined' !== typeof item.integral) out.integral = item.integral;
      if ('undefined' !== typeof item.numeric) out.numeric = item.numeric;
      return out;
    });

    checker(sample, {
      name: 0
    }, function(item) {
      delete item.name;
      return item;
    });

    checker(sample, {
      integral: 0,
      numeric: 0
    }, function(item) {
      delete item.integral;
      delete item.numeric;
      return item;
    });

    checker(sample, {
      name: 0,
      integral: 0,
      numeric: 0
    }, function(item) {
      delete item.name;
      delete item.integral;
      delete item.numeric;
      return item;
    });

    checker(sample, null, null);

    checker(sample, {}, null);

    // function type is not allowed at MongoDB
    // checker(sample, _name, _name, '[Function]');
  };
}
