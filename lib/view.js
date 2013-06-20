/*! view.js */

/**
 * This generates a projection function compiled from view mapping parameters object.
 *
 * @method obop.prototype.view
 * @param {Object|Function} projection - mapping parameters or function
 * @param {Object} options - options: nop
 * @returns {Function} function for Array.prototype.map() etc.
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
 * var out1 = list.map(function(item) {
 *     return { name: item.name };
 * });
 * console.log(out1);
 *
 * // with obop
 * var view = { name: 1 };
 * var out2 = list.map(obop.view(view));
 * console.log(out2);
 */

exports.view = function(projection) {

  // function type
  if ('function' == typeof projection) {
    return projection;
  }

  // default parameters
  projection = projection || {};

  // settings
  var obop = this || require('../index');
  var settings = obop.settings || {};

  // no operation
  var _nop = settings.nop ? nop : null;

  // other types than object
  if ('object' != typeof projection) {
    var err = new Error('Invalid update operator type: ' + projection);
    if (settings.throwError) {
      throw err;
    } else {
      return err;
    }
  }

  var queries = Object.keys(projection);

  // no projection: all properties
  if (!queries.length) {
    return _nop;
  }

  // one property: faster
  if (queries.length == 1) {
    var key0 = queries[0];
    if (projection[key0]) {
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
  for (var key in projection) {
    if (projection[key]) {
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
      if (projection[key]) {
        out[key] = item[key];
      }
    });
    return out;
  };
};

function nop(item) {
  return item;
}
