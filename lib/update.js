/*! update.js */

/**
 * This generates an update compiled function from update-clause operator object.
 *
 * @method obop.prototype.update
 * @param {Object|Function} update - update operators or function
 * @param {Object} options - options: nop
 * @returns {Function} function for Array.prototype.map() etc.
 * @see http://docs.mongodb.org/manual/reference/operator/#update-operators
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
 *     item.sale = true;
 *     item.price -= 5;
 *     return item;
 * });
 * console.log(out1);
 *
 * // with obop
 * var update = { $set: { sale: true }, $inc: { price: -5 } };
 * var out2 = list.filter(obop.update(update));
 * console.log(out2);
 */

exports.update = function(update) {
  var err;

  // function type
  if ('function' == typeof update) {
    return update;
  }

  // default parameters
  update = update || {};

  // settings
  var obop = this || require('../index');
  var settings = obop.settings || {};

  // no operation
  var _nop = settings.nop ? nop : null;

  // no operators: through
  if (!Object.keys(update)) {
    return _nop;
  }

  // other types than object
  if ('object' != typeof update) {
    err = new Error('Invalid update operator type: ' + update);
    if (settings.throwError) {
      throw err;
    } else {
      return err;
    }
  }

  // parse operators
  var array = [];
  for (var key in update) {
    if (!obop.$update[key]) return error('Unknown update operator: ' + key);
    var gen = obop.$update[key];
    var f = gen(update[key]);
    array.push(f);
  }

  // one operator type used
  if (array.length < 2) {
    return array.shift() || _nop;
  }

  // more operator types used
  return join(array);
};

function join(array) {
  var len = array.length;
  return function(item) {
    for (var i = 0; i < len; i++) {
      var update = array[i];
      item = update(item);
    }
    return item;
  };
}

function nop(item) {
  return item;
}
