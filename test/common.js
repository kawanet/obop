/*! common.js */

var assert = require('chai').assert;
var obop = require('../');
var common = exports;

exports.check_where = function(sample, where, func, mess) {
  mess = mess || JSON.stringify(where);
  if (func instanceof Error) mess += " // " + func;
  it(mess, function(done) {
    common.obop_where(sample, where, func, function(actual) {
      if (func instanceof Error) return done();
      common.expect_where(sample, where, func, function(expect) {
        assert.deepEqual(actual, expect);
        done();
      });
    });
  });
};

exports.obop_where = function(sample, where, func, next) {
  sample = common.clone(sample);
  var result = sample;
  var selector;
  try {
    selector = obop.where(where);
  } catch(e) {
    selector = e;
  }
  if (func instanceof Error) {
    assert.ok(selector instanceof Error, 'where() should return an error: ' + selector);
    next(selector);
    return;
  } else {
    assert.notOk(selector instanceof Error, 'where() should not return an error: ' + selector);
  }
  if (selector) {
    assert.equal(typeof selector, 'function', 'selector should be a function');
    result = sample.filter(selector);
  }
  assert.ok(result instanceof Array, 'obop result should be an array');
  next(result);
};

exports.expect_where = function(sample, where, func, next) {
  sample = common.clone(sample);
  var result = sample;
  if (func instanceof Error) {
    next(); // ignore
    return;
  }
  if (func) {
    assert.equal(typeof func, 'function', 'expecter should be a function');
    result = sample.filter(func);
  }
  assert.ok(result instanceof Array, 'expecter result should be an array');
  next(result);
};

exports.check_view = function(sample, view, func, mess) {
  mess = mess || JSON.stringify(view);
  it(mess, function(done) {
    common.obop_view(sample, view, func, function(actual) {
      common.expect_view(sample, view, func, function(expect) {
        assert.deepEqual(actual, expect);
        done();
      });
    });
  });
};

exports.obop_view = function(sample, view, func, next) {
  sample = common.clone(sample);
  var result = sample;
  var projection = obop.view(view);
  assert.notOk(projection instanceof Error, 'view() should not return an error: ' + projection);
  if (projection) {
    assert.equal(typeof projection, 'function', 'projection should be a function');
    result = sample.map(projection);
  }
  assert.ok(result instanceof Array, 'obop result should be an array');
  next(result);
};

exports.expect_view = function(sample, view, func, next) {
  sample = common.clone(sample);
  var result = sample;
  if (func) {
    assert.equal(typeof func, 'function', 'expecter should be a function');
    result = sample.map(func);
  }
  assert.ok(result instanceof Array, 'expecter result should be an array');
  next(result);
};

exports.check_order = function(sample, order, func, mess) {
  mess = mess || JSON.stringify(order);
  it(mess, function(done) {
    common.obop_order(sample, order, func, function(actual) {
      common.expect_order(sample, order, func, function(expect) {

        var view = {};
        Object.keys(order || {}).forEach(function(key) {
          view[key] = 1;
        });
        var projection = obop.view(view);
        if (projection) {
          actual = actual.map(projection);
          expect = expect.map(projection);
        }

        // assert.deepEqual(actual, expect);

        actual = JSON.stringify(actual, null, "");
        expect = JSON.stringify(expect, null, "");
        actual = actual.replace(/\},\{"/g, '},\n{"');
        expect = expect.replace(/\},\{"/g, '},\n{"');
        assert.equal(actual, expect);

        done();
      });
    });
  });
};

exports.obop_order = function(sample, order, func, next) {
  sample = common.clone(sample);
  var result = sample;
  var sorter = obop.order(order);
  assert.notOk(sorter instanceof Error, 'order() should not return an error: ' + sorter);
  if (sorter) {
    assert.equal(typeof sorter, 'function', 'sorter should be a function');
    result = sample.sort(sorter);
  }
  assert.ok(result instanceof Array, 'obop result should be an array');
  next(result);
};

exports.expect_order = function(sample, order, func, next) {
  sample = common.clone(sample);
  var result = sample;
  if (func) {
    assert.equal(typeof func, 'function', 'expecter should be a function');
    result = sample.sort(func);
  }
  assert.ok(result instanceof Array, 'expecter result should be an array');
  next(result);
};

exports.check_update = function(sample, update, func, mess) {
  mess = mess || JSON.stringify(update);
  it(mess, function(done) {
    common.obop_update(sample, update, func, function(actual) {
      common.expect_update(sample, update, func, function(expect) {
        actual = common.sort_fields(actual);
        expect = common.sort_fields(expect);
        assert.deepEqual(actual, expect);
        done();
      });
    });
  });
};

exports.obop_update = function(sample, update, func, next) {
  sample = common.clone(sample);
  var result = sample;
  var updater = obop.update(update);
  assert.notOk(updater instanceof Error, 'update() should not return an error: ' + updater);
  if (updater) {
    assert.equal(typeof updater, 'function', 'updater should be a function');
    result = sample.map(updater);
  }
  assert.ok(result instanceof Array, 'obop result should be an array');
  next(result);
};

exports.expect_update = function(sample, update, func, next) {
  sample = common.clone(sample);
  var result = sample;
  if (func) {
    assert.equal(typeof func, 'function', 'expecter should be a function');
    result = sample.map(func);
  }
  assert.ok(result instanceof Array, 'expecter result should be an array');
  next(result);
};

exports.sort_fields = function(result) {
  result = result.map(function(item) {
    var out = {};
    Object.keys(item).sort().forEach(function(key) {
      out[key] = item[key];
    });
    return out;
  });
  return result;
};

exports.clone = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};
