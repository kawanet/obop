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
    return error('Invalid update operator type: ' + selector);
  }

  // group queries
  var equal = {};
  var complex = {};
  var hasdot = {};
  for (var key1 in selector) {
    var val1 = selector[key1];
    var pos1 = key1.indexOf('.');
    if (pos1 > -1) {
      var pre1 = key1.substr(0, pos1);
      var post1 = key1.substr(pos1 + 1);
      hasdot[pre1] = hasdot[pre1] || {};
      hasdot[pre1][post1] = val1;
    } else if ('object' == typeof val1) {
      complex[key1] = val1;
    } else {
      equal[key1] = val1;
    }
  }

  var array = [];

  // equal query
  var sckeys = Object.keys(equal);
  if (sckeys.length == 1) {
    var key = sckeys[0];
    var val = selector[key];
    // one selector: faster
    var single_eq = function(item) {
      return item && item[key] == val;
    };
    array.push(single_eq);
  } else if (sckeys.length > 1) {
    var multiple_eq = function(item) {
      if (!item) return false;
      for (var key in equal) {
        if (item[key] != equal[key]) return false;
      }
      return true;
    };
    array.push(multiple_eq);
  }

  // child element
  Object.keys(hasdot).forEach(function(key) {
    var val = hasdot[key];
    var where = obop.where(val);
    if (!where) return;
    var child = function(item) {
      return item && where(item[key]);
    };
    array.push(child);
  });

  // complex query
  if (Object.keys(complex).length) {
    return error('complex format not supported');
  }

  // one query type used
  if (array.length < 2) {
    return array.shift() || _nop;
  }

  // more query types used
  var len = array.length;
  return function(item) {
    for (var i = 0; i < len; i++) {
      var f = array[i];
      if (!f(item)) return false;
    }
    return true;
  };

  // throw or return error

  function error(mess) {
    var err = new Error('Invalid update operator type: ' + selector);
    if (settings.throwError) {
      throw err;
    } else {
      return err;
    }
  }
};

function nop(item) {
  return true;
}
