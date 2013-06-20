/*! view.js */

/**
 * This filters fields of items, or generates a projection function compiled from view mapping parameters object.
 *
 * @method obop.prototype.view
 * @param {Array} [array] - source array to map
 * @param {Object|Function} param - output fields or function
 * @returns {Array} Array of filtered items (if source array given)
 * @returns {Function} Projection function compiled for Array.prototype.map() method (if source array not given)
 * @returns {Error} Error instance (if source array not given but invalid output fields specified)
 *
 * @example
 * var list = [
 *    { name: "apple", price: 50 },
 *    { name: "orange", price: 10 },
 *    { name: "pineapple", price: 70 },
 *    { name: "grape", price: 30 }
 * ];
 *
 * // map without obop
 * var out1 = list.map(function(item) {
 *     return { name: item.name };
 * });
 * console.log(out1);
 *
 * // map with obop
 * var view = { name: 1 };
 * var out2 = obop.view(list, view);
 * console.log(out2);
 *
 * // compile a map function
 * var view = { name: 1 };
 * var filter = obop.view(view);
 * if (filter instanceof Error) throw filter;
 * var out3 = list.map(filter);
 * console.log(out3);
 */

exports.view = function(array, param) {
  var func;
  var len = arguments.length;
  if (len == 1) {
    func = view.call(this, array);
    if (func instanceof Error) throw func;
    return func;
  } else if (len == 2) {
    if (array instanceof Array) {
      func = view.call(this, param);
      if (func instanceof Error) throw func;
      return array.map(func);
    } else {
      throw new Error('Invalid argument type: ' + array);
    }
  } else {
    throw new Error('Invalid arguments length: ' + len);
  }
};

function view(param) {
  var obop = this;
  var _nop = null; // no operation

  // function type
  if ('function' == typeof param) {
    return param;
  }

  // default parameters
  param = param || {};

  // other types than object
  if ('object' != typeof param) {
    return new Error('Invalid update operator type: ' + param);
  }

  var queries = Object.keys(param);

  // no param: all properties
  if (!queries.length) {
    return _nop;
  }

  // one property: faster
  if (queries.length == 1) {
    var key0 = queries[0];
    if (param[key0]) {
      return function(item) {
        var out = {};
        if (item.hasOwnProperty(key0)) {
          out[key0] = item[key0];
        }
        return out;
      };
    }
  }

  // test all values are falsy
  var hasTrue;
  var falsy = {};
  for (var key in param) {
    if (param[key]) {
      hasTrue = true;
    } else {
      falsy[key] = true;
    }
  }

  // negative filter
  if (!hasTrue) {
    return function(item) {
      var out = {};
      Object.keys(item).forEach(function(key) {
        if (!falsy[key]) {
          out[key] = item[key];
        }
      });
      return out;
    };
  }

  // more properties
  return function(item) {
    var out = {};
    Object.keys(item).forEach(function(key) {
      if (param[key]) {
        out[key] = item[key];
      }
    });
    return out;
  };
}
