var sample4 = require('./data/sample4.json');
var common = require('./common');

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_view;
  describe(prefix + 'view-02', function() {
    describe('sample4', tests(checker, sample4));
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports();
}

function tests(checker, sample) {
  return function() {

    // single dot
    checker(sample, {
      "foo.bar": 1
    }, function(src) {
      var out = {};
      if ('object' === typeof src.foo) {
        out.foo = {};
        if (src.foo.bar) out.foo.bar = src.foo.bar;
      }
      return out;
    });

    // combination
    checker(sample, {
      "name": 1,
      "foo.bar": 1
    }, function(src) {
      var out = {};
      out.name = src.name;
      if ('object' === typeof src.foo) {
        out.foo = {};
        if (src.foo.bar) out.foo.bar = src.foo.bar;
      }
      return out;
    });

    // more nests
    checker(sample, {
      "name": 1,
      "foo.qux.quux": 1
    }, function(src) {
      var out = {};
      out.name = src.name;
      if ('object' === typeof src.foo) {
        out.foo = {};
        if ('object' === typeof src.foo.qux) {
          out.foo.qux = {};
          if (src.foo.qux.quux) out.foo.qux.quux = src.foo.qux.quux;
        }
      }
      return out;
    });

    // more complex
    checker(sample, {
      "name": 1,
      "foo.bar": 1,
      "foo.qux.quux": 1,
      "hoge.fuga": 1
    }, function(src) {
      var out = {};
      out.name = src.name;
      if ('object' === typeof src.foo) {
        out.foo = {};
        if (src.foo.bar) out.foo.bar = src.foo.bar;
      }
      if ('object' === typeof src.foo && 'object' === typeof src.foo.qux && src.foo.qux.quux) {
        out.foo = out.foo || {};
        out.foo.qux = {};
        out.foo.qux.quux = src.foo.qux.quux;
      }
      if ('object' === typeof src.hoge && src.hoge.fuga) {
        out.hoge = {};
        out.hoge.fuga = src.hoge.fuga;
      }
      return out;
    });

    // combination
    checker(sample, {
      "foo.bar": 0,
      "foo.qux": 0
    }, function(src) {
      var out = {};
      out.name = src.name;
      if ('object' !== typeof src.foo && src.foo) {
        out.foo = src.foo;
      }
      if ('object' === typeof src.foo) {
        out.foo = {};
        if (src.foo.baz) out.foo.baz = src.foo.baz;
      }
      if (src.hoge) {
        out.hoge = src.hoge;
      }
      return out;
    });

    // more complex
    checker(sample, {
      "name": 0,
      "foo.baz": 0,
      "hoge.fuga": 0
    }, function(src) {
      var out = {};
      if ('object' !== typeof src.foo && src.foo) {
        out.foo = src.foo;
      }
      if ('object' === typeof src.foo) {
        out.foo = {};
        if (src.foo.bar) out.foo.bar = src.foo.bar;
      }
      if ('object' === typeof src.foo && 'object' === typeof src.foo.qux && src.foo.qux.quux) {
        out.foo = out.foo || {};
        out.foo.qux = {};
        out.foo.qux.quux = src.foo.qux.quux;
      }
      if ('object' === typeof src.hoge) {
        out.hoge = {};
      }
      return out;
    });

    // MongoError: You cannot currently mix including and excluding fields.
    if (checker !== common.check_view) return;

    // positive and negative
    checker(sample, {
      "name": 1,
      "foo": 1,
      "foo.baz": 0
    }, function(src) {
      var out = {};
      out.name = src.name;
      if ('object' !== typeof src.foo && src.foo) {
        out.foo = src.foo;
      }
      if ('object' === typeof src.foo) {
        out.foo = {};
        if (src.foo.bar) out.foo.bar = src.foo.bar;
      }
      if ('object' === typeof src.foo && 'object' === typeof src.foo.qux && src.foo.qux.quux) {
        out.foo = out.foo || {};
        out.foo.qux = {};
        out.foo.qux.quux = src.foo.qux.quux;
      }
      return out;
    });
  };
}
