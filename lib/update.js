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

  // list of supported operators
  var ope = obop.system.update;

  // check operators supported or not
  for (var key in update) {
    if (ope[key] && 'object' === typeof update[key]) continue;
    err = new Error('Unknown update operator parameter: ' + key);
    if (settings.throwError) {
      throw err;
    } else {
      return err;
    }
  }

  // update function
  return function(item) {
    var key, val, old;

    // through when empty
    if (!item) return item;

    // Sets the value of a field in an existing document.
    if (update.$set) {
      for (key in update.$set) {
        item[key] = update.$set[key];
      }
    }

    // Removes the specified field from an existing document.
    if (update.$unset) {
      for (key in update.$unset) {
        delete item[key];
      }
    }

    // Renames a field.
    if (update.$rename) {
      for (key in update.$rename) {
        val = update.$rename[key];
        item[val] = item[key];
        delete item[key];
      }
    }

    // Adds an item to an array.
    if (update.$push) {
      for (key in update.$push) {
        old = item[key];
        if (old instanceof Array) {
          // ok
        } else if ('undefined' == typeof old) {
          item[key] = [];
        } else {
          item[key] = [old];
        }
        val = update.$push[key];
        item[key].push(val);
      }
    }

    // Removes items from an array that match a query statement.
    if (update.$pull) {
      for (key in update.$pull) {
        val = update.$pull[key];
        old = item[key];
        if (old instanceof Array) {
          var tmp = [];
          var len = old.length;
          for (var i = 0; i < len; i++) {
            var test = old[i];
            if (val != test) tmp.push(test);
          }
          item[key] = tmp;
        } else if (val == old) {
          item[key] = []; // empty array
        }
      }
    }

    // Increments the value of the field by the specified amount.
    if (update.$inc) {
      for (key in update.$inc) {
        val = update.$inc[key];
        old = item[key];
        val = parseFloat(val) || 0;
        old = parseFloat(old) || 0;
        item[key] = old + val;
      }
    }
    return item;
  };
};

function nop(item) {
  return item;
}
