var obop = require('../');
var sample4 = require('./data/sample4.json');
var assert = require('chai').assert;
var common = require('./common');

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_order;
  describe(prefix + 'order-03', function() {
    describe('sample4', tests(checker, sample4));
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports();
}

function tests(checker, sample) {
  return function() {

    var undef;

    checker(sample, {
      "foo.bar": 1,
      name: 1
    }, function(a, b) {
      var afoo = a.foo || {};
      var bfoo = b.foo || {};
      if (afoo.bar > bfoo.bar) {
        return 1;
      } else if (afoo.bar < bfoo.bar) {
        return -1;
      } else if (afoo.bar !== undef && bfoo.bar === undef) { // a.foo.bar > b.foo.bar == undef
        return 1;
      } else if (afoo.bar === undef && bfoo.bar !== undef) { // b.foo.bar > a.foo.bar == undef
        return -1;
      }
      return ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    checker(sample, {
      "foo.baz": 1,
      "foo.bar": -1,
      name: -1
    }, function(a, b) {
      var afoo = a.foo || {};
      var bfoo = b.foo || {};
      if (afoo.baz > bfoo.baz) {
        return 1;
      } else if (afoo.baz < bfoo.baz) {
        return -1;
      } else if (afoo.baz !== undef && bfoo.baz === undef) {
        return 1;
      } else if (afoo.baz === undef && bfoo.baz !== undef) {
        return -1;
      }
      if (afoo.bar > bfoo.bar) {
        return -1;
      } else if (afoo.bar < bfoo.bar) {
        return 1;
      } else if (afoo.bar !== undef && bfoo.bar === undef) {
        return -1;
      } else if (afoo.bar === undef && bfoo.bar !== undef) {
        return 1;
      }
      return ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    checker(sample, {
      "foo.qux.quux": 1,
      name: 1
    }, function(a, b) {
      var afoo = a.foo || {};
      var bfoo = b.foo || {};
      var aqux = afoo.qux || {};
      var bqux = bfoo.qux || {};
      if (aqux.quux > bqux.quux) {
        return 1;
      } else if (aqux.quux < bqux.quux) {
        return -1;
      } else if (aqux.quux !== undef && bqux.quux === undef) {
        return 1;
      } else if (aqux.quux === undef && bqux.quux !== undef) {
        return -1;
      }
      return ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    checker(sample, [
      ["foo.bar", -1],
      ["name", -1]
    ], function(a, b) {
      var afoo = a.foo || {};
      var bfoo = b.foo || {};
      if (afoo.bar > bfoo.bar) {
        return -1;
      } else if (afoo.bar < bfoo.bar) {
        return 1;
      } else if (afoo.bar !== undef && bfoo.bar === undef) { // a.foo.bar > b.foo.bar == undef
        return -1;
      } else if (afoo.bar === undef && bfoo.bar !== undef) { // b.foo.bar > a.foo.bar == undef
        return 1;
      }
      return ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });

    checker(sample, [
      ["foo.baz", -1],
      ["foo.bar", 1],
      ["name", 1]
    ], function(a, b) {
      var afoo = a.foo || {};
      var bfoo = b.foo || {};
      if (afoo.baz > bfoo.baz) {
        return -1;
      } else if (afoo.baz < bfoo.baz) {
        return 1;
      } else if (afoo.baz !== undef && bfoo.baz === undef) {
        return -1;
      } else if (afoo.baz === undef && bfoo.baz !== undef) {
        return 1;
      }
      if (afoo.bar > bfoo.bar) {
        return 1;
      } else if (afoo.bar < bfoo.bar) {
        return -1;
      } else if (afoo.bar !== undef && bfoo.bar === undef) {
        return 1;
      } else if (afoo.bar === undef && bfoo.bar !== undef) {
        return -1;
      }
      return ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    });

    checker(sample, [
      ["foo.qux.quux", -1],
      ["name", -1]
    ], function(a, b) {
      var afoo = a.foo || {};
      var bfoo = b.foo || {};
      var aqux = afoo.qux || {};
      var bqux = bfoo.qux || {};
      if (aqux.quux > bqux.quux) {
        return -1;
      } else if (aqux.quux < bqux.quux) {
        return 1;
      } else if (aqux.quux !== undef && bqux.quux === undef) {
        return -1;
      } else if (aqux.quux === undef && bqux.quux !== undef) {
        return 1;
      }
      return ((a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
    });
  };
}
