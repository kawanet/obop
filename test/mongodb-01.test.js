var obop = require('../');
var assert = require('chai').assert;
var MongoClient = require('mongodb').MongoClient;
var common = require('./common');

exports.DONT_RUN_TESTS_ON_REQUIRE = true;

var url = process.env.TEST_MONGODB;
var colName = __filename.replace(/^.*\//, '').replace(/\.\w+$/, '').replace(/\W/g, '_');
var collection;

describe('mongodb-01', function() {
  if (!url) {
    it('env TEST_MONGODB="mongodb://localhost:27017/test" grunt', function(done) {
      done();
    });
    return;
  }

  it('connect: ' + url, function(done) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(err, null);
      collection = db.collection(colName);
      after(function(done) {
        db.on('close', done);
        db.close();
      });
      collection.remove(function(err) {
        assert.equal(err, null);
        main();
        done();
      });
    });
  });
});

function main() {
  require('./where-01.test')('mongodb-01-', checker);
  require('./where-02.test')('mongodb-01-', checker);
  require('./where-03.test')('mongodb-01-', checker);
}

function checker(sample, where, func, mess) {
  mess = mess || JSON.stringify(where);
  it(mess, function(done) {
    common.obop_where(sample, where, func, function(actual) {
      mongodb_where(sample, where, func, function(expect) {
        assert.deepEqual(actual, expect);
        done();
      });
    });
  });
}

function mongodb_where(sample, where, tester, next) {
  sample = common.clone(sample);
  collection.remove(function(err) {
    assert.equal(err, null);
    collection.insert(sample, function(err) {
      assert.equal(err, null);
      collection.find(where, {
        _id: 0
      }).sort({
        _id: 1
      }).toArray(function(err, result) {
        assert.equal(err, null);
        assert.ok(result instanceof Array, 'result should be an array');
        next(result);
      });
    });
  });
}
