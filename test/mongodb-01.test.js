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
  require('./where-01.test')('mongodb-01-', check_where);
  require('./where-02.test')('mongodb-01-', check_where);
  require('./where-03.test')('mongodb-01-', check_where);
  require('./view-01.test')('mongodb-01-', check_view);
  require('./order-01.test')('mongodb-01-', check_order);
}

function check_where(sample, where, func, mess) {
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
  prepare(sample, function() {
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
}

function check_view(sample, view, func, mess) {
  mess = mess || JSON.stringify(view);
  it(mess, function(done) {
    common.obop_view(sample, view, func, function(actual) {
      mongodb_view(sample, view, func, function(expect) {
        assert.deepEqual(actual, expect);
        done();
      });
    });
  });
}

function mongodb_view(sample, view, tester, next) {
  // Uncaught TypeError: Object.getOwnPropertyNames called on non-object
  // at Collection.find (node_modules/mongodb/lib/mongodb/collection.js:814:28)
  view = view || {};

  prepare(sample, function() {
    collection.find({}, view).sort({
      _id: 1
    }).toArray(function(err, result) {
      // console.error(result);
      assert.equal(err, null);
      assert.ok(result instanceof Array, 'result should be an array');
      result.forEach(function(item) {
        delete item._id;
      });
      next(result);
    });
  });
}

function check_order(sample, order, func, mess) {
  mess = mess || JSON.stringify(order);
  it(mess, function(done) {
    common.obop_order(sample, order, func, function(actual) {
      mongodb_order(sample, order, func, function(expect) {
        assert.deepEqual(actual, expect);
        done();
      });
    });
  });
}

function mongodb_order(sample, order, tester, next) {
  order = order || {};
  if (!Object.keys(order).length) {
    order = {
      _id: 1
    };
  }
  prepare(sample, function() {
    collection.find({}, {
      _id: 0
    }).sort(order).toArray(function(err, result) {
      // console.error(result);
      assert.equal(err, null);
      assert.ok(result instanceof Array, 'result should be an array');
      next(result);
    });
  });
}

function prepare(sample, next) {
  sample = common.clone(sample);
  collection.remove(function(err) {
    assert.equal(err, null);
    collection.insert(sample, function(err) {
      assert.equal(err, null);
      next();
    });
  });
}
