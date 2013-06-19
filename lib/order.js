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
    var err = new Error('Invalid order operator type: ' + sort);
    if (settings.throwError) {
      throw err;
    } else {
      return err;
    }
  }

  var fields = Object.keys(sort);

  // no sort operator
  if (!fields.length) {
    return _nop;
  }

  // one field: faster
  if (fields.length == 1) {
    var key = fields[0];
    if (fields[key]) {
      var ret = sort[key];
      return function(a, b) {
        return (a[key] < b[key]) ? -ret : (a[key] > b[key]) ? ret : 0;
      };
    }
  }

  // more fields
  return function(a, b) {
    for (var key in sort) {
      if (a[key] < b[key]) {
        return -sort[key];
      } else if (a[key] > b[key]) {
        return sort[key];
      }
    }
  };
};

function nop(a, b) {
  return 0;
}
