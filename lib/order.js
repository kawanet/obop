/*! order.js */

/**
 * This generates an order function compiled from order-by-clause operator object.
 *
 * @method obop.prototype.order
 * @param {Object|Function} sort - sort parameters or function
 * @param {Object} settings - settings: nop
 * @property {Function} nop - obop.order().nop - through function
 * @returns {Function} function for Array.prototype.sort() etc.
 *
 * @example
 * var list = [
 *    { name: "apple", price: 50 },
 *    { name: "orange", price: 10 },
 *    { name: "pineapple", price: 70 },
 *    { name: "grape", price: 30 }
 * ];
 *
 * // without obop
 * var out1 = list.sort(function(a, b) {
 *     return a.price - b.price;
 * });
 * console.log(out1);
 *
 * // with obop
 * var order = { price: 1 };
 * var out2 = list.sort(obop.order(order));
 * console.log(out2);
 */

exports.order = function(sort) {
  var key, ret;

  // function type
  if ('function' == typeof sort) {
    return sort;
  }

  // default parameters
  sort = sort || {};

  // settings
  var obop = this || require('../index');
  var settings = obop.settings || {};

  // no operation
  var _nop = settings.nop ? nop : null;

  // other types than object
  if ('object' != typeof sort) {
    return error('Invalid order operator type: ' + sort);
  }

  // Array format: [ ["foo", 1], ["bar", -1] ]
  if (sort instanceof Array) {
    // each pair must have a couple of elements
    var err;
    sort.forEach(function(pair) {
      if (err) return;
      if ((pair instanceof Array) &&
        (pair.length === 2) &&
        ('undefined' !== typeof pair[0]) &&
        (pair[1] - pair[1] === 0)) {
        // ok
      } else {
        err = 'Invalid order pair: ' + pair;
      }
    });
    if (err) return error(err);

    if (sort.length === 0) {

      // no sort operators
      return _nop;

    } else if (sort.length === 1) {

      // one field: faster shortcut
      key = sort[0][0];
      ret = sort[0][1];
      return single;
    }

    // more fields
    var len = sort.length;
    return function(a, b) {
      for (var i = 0; i < len; i++) {
        var key = sort[i][0];
        var ret = sort[i][1];
        if (a[key] < b[key]) {
          return -ret;
        } else if (a[key] > b[key]) {
          return ret;
        }
      }
    };
  }

  // Object format: { "foo": 1, "bar": -1 }
  var fields = Object.keys(sort);

  if (fields.length === 0) {

    // no sort operators
    return _nop;

  } else if (fields.length === 1) {

    // one field: faster shortcut
    key = fields[0];
    ret = sort[key];
    if (fields[key]) return single;
  }

  // more fields
  return function(a, b) {
    for (var key in sort) {
      var ret = sort[key];
      if (a[key] < b[key]) {
        return -ret;
      } else if (a[key] > b[key]) {
        return ret;
      }
    }
  };

  // single field

  function single(a, b) {
    return (a[key] < b[key]) ? -ret : (a[key] > b[key]) ? ret : 0;
  }

  // throw or return error

  function error(mess) {
    var err = new Error(mess);
    if (settings.throwError) {
      throw err;
    } else {
      return err;
    }
  }
};

function nop(a, b) {
  return 0;
}
