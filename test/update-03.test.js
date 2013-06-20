var sample3 = require('./data/sample3.json');
var common = require('./common');

// Note: this test works only on obop but not on MongoDB

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_update;
  describe(prefix + 'update-03', function() {
    describe('sample3', tests(checker, sample3));
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports();
}

function tests(checker, sample) {
  return function() {
    // $set
    checker(sample, {
      $set: {
        "a.b": {
          "g": "G"
        }
      }
    }, function(item) {
      if ('object' !== typeof item.a) item.a = {};
      item.a.b = {
        "g": "G"
      };
      return item;
    });

    // $set
    checker(sample, {
      $set: {
        "a.b.c": "C",
        "a.f": "F"
      }
    }, function(item) {
      if ('object' !== typeof item.a) item.a = {};
      if ('object' !== typeof item.a.b) item.a.b = {};
      item.a.b.c = "C";
      item.a.f = "F";
      return item;
    });

    // $unset
    checker(sample, {
      $unset: {
        "a.b": ""
      }
    }, function(item) {
      if ('object' !== typeof item.a) item.a = {};
      delete item.a.b;
      return item;
    });

    // $unset
    checker(sample, {
      $unset: {
        "a.b.c": "",
        // "a.i.j": "", // not supported
        "a.h": ""
      }
    }, function(item) {
      if ('object' !== typeof item.a) item.a = {};
      if ('object' !== typeof item.a.b) item.a.b = {};
      delete item.a.b.c;
      return item;
    });

    // $inc
    checker(sample, {
      $inc: {
        "a.b.c": 1
      }
    }, function(item) {
      if ('object' !== typeof item.a) item.a = {};
      if ('object' !== typeof item.a.b) item.a.b = {};
      item.a.b.c = (item.a.b.c || 0) + 1;
      return item;
    });

    // $push
    checker(sample, {
      $push: {
        "foo.bar": 111,
        "baz.qux.quux": 222
      }
    }, function(item) {
      if ('object' !== typeof item.foo) item.foo = {};
      item.foo.bar = [];
      item.foo.bar.push(111);
      if ('object' !== typeof item.baz) item.baz = {};
      if ('object' !== typeof item.baz.qux) item.baz.qux = {};
      item.baz.qux.quux = [];
      item.baz.qux.quux.push(222);
      return item;
    });

    // $pull
    // [MongoError: Field name duplication not allowed with modifiers]
    checker(sample, {
      $push: {
        "foo.bar": 333,
        "baz.qux.quux": 444
      },
      $pull: {
        "foo.bar": 333,
        "baz.qux.quux": 444
      }
    }, function(item) {
      // push
      if ('object' !== typeof item.foo) item.foo = {};
      item.foo.bar = [];
      item.foo.bar.push(333);
      // push
      if ('object' !== typeof item.baz) item.baz = {};
      if ('object' !== typeof item.baz.qux) item.baz.qux = {};
      item.baz.qux.quux = [];
      item.baz.qux.quux.push(444);
      // pull
      item.foo.bar = item.foo.bar.filter(function(val) {
        return val !== 333;
      });
      // pull
      item.baz.qux.quux = item.baz.qux.quux.filter(function(val) {
        return val !== 444;
      });
      return item;
    });
  };
}
