var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;

describe('update-01', function() {
  describe('sample1', tests(sample1));
  describe('sample2', tests(sample2));
});

function updatetest(sample, update, tester, mess) {
  mess = mess || JSON.stringify(update);
  it(mess, function(done) {
    var updater = obop.update(update);
    assert.equal(typeof updater, 'function', 'updater should be a function');
    var actual = clone(sample).filter(updater);
    var expect = clone(sample).filter(tester);
    assert.deepEqual(actual, expect);
    done();
  });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function tests(sample) {
  return function() {
    // $set
    updatetest(sample, {
      $set: {
        string: "STRING",
        integral: 9999
      }
    }, function(item) {
      item.string = "STRING";
      item.integral = 9999;
      return item;
    });

    // $unset
    updatetest(sample, {
      $unset: {
        string: "",
        numeric: ""
      }
    }, function(item) {
      delete item.string;
      delete item.numeric;
      return item;
    });

    // $rename
    updatetest(sample, {
      $rename: {
        numeric: "number",
        string: "text"
      }
    }, function(item) {
      var tmp;
      tmp = item.numeric;
      delete item.numeric;
      item.number = tmp;
      tmp = item.string;
      delete item.string;
      item.text = tmp;
      return item;
    });

    // $inc
    updatetest(sample, {
      $inc: {
        integral: 1,
        numeric: -11.11
      }
    }, function(item) {
      item.integral = (item.integral || 0) + 1;
      item.numeric = (item.numeric || 0) - 11.11;
      return item;
    });

    // multiple-1
    updatetest(sample, {
      $set: {
        string: "STRING"
      },
      $unset: {
        numeric: ""
      },
      $rename: {
        integral: "number"
      }
    }, function(item) {
      item.string = "STRING";
      delete item.numeric;
      var tmp;
      tmp = item.integral;
      delete item.integral;
      item.number = tmp;
      return item;
    });

    // multiple-2
    updatetest(sample, {
      $unset: {
        string: ""
      },
      $rename: {
        numeric: "number"
      },
      $inc: {
        integral: 1
      }
    }, function(item) {
      delete item.string;
      var tmp;
      tmp = item.numeric;
      delete item.numeric;
      item.number = tmp;
      item.integral = (item.integral || 0) + 1;
      return item;
    });

    // null
    updatetest(sample, null, through);

    // empty object
    updatetest(sample, {}, through);

    // function
    updatetest(sample, through, through, '[Function]');
  };
}

function through(item) {
  return item;
}
