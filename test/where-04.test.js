var obop = require('../');
var sample1 = require('./data/sample1.json');
var sample2 = require('./data/sample2.json');
var assert = require('chai').assert;
var common = require('./common');

describe('where-04', function() {
  describe('sample1', tests(common.check_where, sample1));
});

function tests(checker, sample) {
  return function() {

    checker(sample, {
      "integral": "3456"
    }, function(item) {
      return item.integral == "3456";
    });

    checker(sample, {
      "numeric": "33.33"
    }, function(item) {
      return item.numeric == "33.33";
    });

    checker(sample, {
      "integral": "5678",
      "numeric": "22.22"
    }, function(item) {
      return item.integral == "5678" && item.numeric == "22.22";
    });

    checker(sample, india, india, '[Function]');
  };
}

function india(item) {
  return item.name == 'india';
}
