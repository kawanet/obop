/*! where.js */

/**
 * This generates a conditional function compiled from where-clause operator object a.k.a query selector.
 *
 * @method obop.prototype.where
 * @param {Object|Function} selector - query parameters or function
 * @param {Object} options - options: nop
 * @returns {Function} function for Array.prototype.filter() etc.
 * @see http://docs.mongodb.org/manual/reference/operator/#query-selectors
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
 * var out1 = list.filter(function(item) {
 *     return item.name == "orange";
 * });
 * console.log(out1);
 *
 * // with obop
 * var where = { name: "orange" };
 * var out2 = list.filter(obop.where(where));
 * console.log(out2);
 */

exports.where = function(selector) {

  // function type
  if ('function' == typeof selector) {
    return selector;
  }

  // default parameters
  selector = selector || {};

  // settings
  var obop = this || require('../index');
  var settings = obop.settings || {};

  // no operation
  var _nop = settings.nop ? nop : null;

  // other types than object
  if ('object' != typeof selector) {
    var err = new Error('Invalid update operator type: ' + selector);
    if (settings.throwError) {
      throw err;
    } else {
      return err;
    }
  }

  var queries = Object.keys(selector);

  // no selector: every item OK
  if (!queries.length) {
    return _nop;
  }

  // one selector: faster
  if (queries.length == 1) {
    var key = queries[0];
    var val = selector[key];
    if ('object' != typeof val) {
      return function(item) {
        return (item[key] == val);
      };
    }
  }

  // more complex conditions:
  return function(item) {
    for (var key in selector) {
      if (item[key] != selector[key]) return false;
    }
    return true;
  };
};

function nop(item) {
  return true;
}
