var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var common = require('./common');

// Note: this test works only on obop but not on MongoDB

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_update;
  describe(prefix + 'update-02', function() {
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

    // null
    checker(sample, null, null);

    // empty object
    checker(sample, {}, null);

    // function
    checker(sample, through, through, '[Function]');

    // $push
    checker(sample, {
      $push: {
        arr: 9999
      }
    }, pusher(9999));

    // $pull
    checker(sample, {
      $pull: {
        arr: 222
      }
    }, puller(222));

    // $pull
    checker(sample, {
      $pull: {
        arr: "bar"
      }
    }, puller("bar"));

    // multiple
    // [MongoError: Field name duplication not allowed with modifiers]
    var m1push = pusher("foobar");
    var m1pull = puller(333);
    checker(sample, {
      $push: {
        arr: "foobar"
      },
      $pull: {
        arr: 333
      }
    }, function(item) {
      return m1pull(m1push(item));
    });

    // multiple
    var m2push = pusher(9999);
    var m2pull = puller("baz");
    checker(sample, {
      $pull: {
        arr: "baz"
      },
      $push: {
        arr: 9999
      }
    }, function(item) {
      return m2push(m2pull(item));
    });
  };
}

function pusher(value) {
  return function(item) {
    var arr = item.arr;
    if (arr instanceof Array) {
      // OK
    } else if ('undefined' == typeof arr) {
      arr = [];
    } else {
      // return item; // ignore (MongoDB does this)
      arr = [arr]; // upgrade (this would be better)
    }
    arr.push(value);
    item.arr = arr;
    return item;
  };
}

function puller(value) {
  return function(item) {
    var arr = item.arr;
    if (arr instanceof Array) {
      // OK
    } else if ('undefined' == typeof arr) {
      arr = [];
    } else {
      arr = [arr];
    }
    var after = arr.filter(function(item) {
      return item != value;
    });
    if (arr.length != after.length) item.arr = after;
    return item;
  };
}

function through(item) {
  return item;
}
