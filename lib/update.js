/*! update.js */

/**
 * This generates an update compiled function from update-clause operator object.
 *
 * @method obop.prototype.update
 * @param {Object|Function} update - update operators or function
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
  var obop = this;
  var _nop = null; // no operation
  var err;

  // function type
  if ('function' == typeof update) {
    return update;
  }

  // default parameters
  update = update || {};

  // no operators: through
  if (!Object.keys(update)) {
    return _nop;
  }

  // other types than object
  if ('object' != typeof update) {
    return new Error('Invalid update operator type: ' + update);
  }

  // parse operators
  var array = [];
  Object.keys(update).forEach(function(op) {
    if (err) return;
    var gen = obop.$update[op];
    if (!gen) {
      err = new Error('Unknown update operator: ' + op);
      return;
    }

    var hash = update[op];
    var root = {};
    var hasdot = {};
    for (var key in hash) {
      var val = hash[key];
      var pos = key.indexOf('.');
      if (pos > -1) {
        // $op: { "pre.post": "val" }
        var pre = key.substr(0, pos);
        var post = key.substr(pos + 1);
        hasdot[pre] = hasdot[pre] || {};
        hasdot[pre][post] = val;
      } else {
        // $op: { "key": "val" }
        root[key] = val;
      }
    }

    // $op: { "key": "val" }
    if (Object.keys(root).length) {
      var f = gen(root);
      array.push(f);
    }

    // $op: { "pre.post": "val" }
    if (Object.keys(hasdot).length) {
      Object.keys(hasdot).forEach(function(key) {
        var tmp = {};
        tmp[op] = hasdot[key];
        var update = obop.update(tmp);
        var f = function(item) {
          var hash = item[key];
          if ('object' !== typeof hash) {
            hash = item[key] = {};
          }
          item[key] = update(hash);
          return item;
        };
        array.push(f);
      });
    }
  });
  if (err) return err;

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
