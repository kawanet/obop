var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var common = require('./common');

module.exports = function(prefix, checker) {
  prefix = prefix || '';
  checker = checker || common.check_update;
  describe(prefix + 'update-01', function() {
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
    // $set
    checker(sample, {
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
    checker(sample, {
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
    checker(sample, {
      $rename: {
        numeric: "number",
        string: "text"
      }
    }, function(item) {
      var tmp;
      tmp = item.numeric;
      if ('undefined' !== typeof tmp) {
        delete item.numeric;
        item.number = tmp;
      }
      tmp = item.string;
      if ('undefined' !== typeof tmp) {
        delete item.string;
        item.text = tmp;
      }
      return item;
    });

    // $inc
    checker(sample, {
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
    checker(sample, {
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
      if ('undefined' !== typeof tmp) {
        delete item.integral;
        item.number = tmp;
      }
      return item;
    });

    // multiple-2
    checker(sample, {
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
      if ('undefined' !== typeof tmp) {
        delete item.numeric;
        item.number = tmp;
      }
      item.integral = (item.integral || 0) + 1;
      return item;
    });
  };
}
