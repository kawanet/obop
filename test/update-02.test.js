var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;

describe('update-02', function() {
  describe('sample1', tests(sample1));
  describe('sample2', tests(sample2));
});

function updatetest(sample, update, tester, mess) {
  mess = mess || JSON.stringify(update);
  it(mess, function(done) {
    var updater = obop.update(update);
    assert.notOk(updater instanceof Error, 'update() should not return an error: ' + updater);
    if (tester) {
      assert.ok('function' == typeof updater, 'updater should be a function but ' + typeof updater);
      var actual = clone(sample).filter(updater);
      var expect = clone(sample).filter(tester);
      assert.deepEqual(actual, expect);
    } else {
      assert.notOk(updater, 'updater should be empty but ' + updater);
    }
    done();
  });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function tests(sample) {
  return function() {

    // $push
    updatetest(sample, {
      $push: {
        arr: 9999
      }
    }, pusher(9999));

    // $pull
    updatetest(sample, {
      $pull: {
        arr: 222
      }
    }, puller(222));

    // $pull
    updatetest(sample, {
      $pull: {
        arr: "bar"
      }
    }, puller("bar"));

    // multiple
    var m1push = pusher("foobar");
    var m1pull = puller(333);
    updatetest(sample, {
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
    updatetest(sample, {
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
      arr = [arr];
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
