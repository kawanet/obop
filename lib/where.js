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

var op1 = {
  // Matches values that are greater than the value specified in the query.
  $gt: function(val) {
    return function(test) {
      return (test > val);
    };
  },

  // Matches values that are equal to or greater than the value specified in the query.
  $gte: function(val) {
    return function(test) {
      return (test >= val);
    };
  },

  // Matches any of the values that exist in an array specified in the query.
  $in: function(arr) {
    var len = arr.length;
    return function(test) {
      for (var i = 0; i < len; i++) {
        if (test == arr[i]) return true;
      }
      return false;
    };
  },

  // Matches vales that are less than the value specified in the query.
  $lt: function(val) {
    return function(test) {
      return (test < val);
    };
  },

  // Matches values that are less than or equal to the value specified in the query.
  $lte: function(val) {
    return function(test) {
      return (test <= val);
    };
  },

  // Matches all values that are not equal to the value specified in the query.
  $ne: function(val) {
    return function(test) {
      return (test != val);
    };
  },

  // Matches values that do not exist in an array specified to the query.
  $nin: function(arr) {
    var len = arr.length;
    return function(test) {
      for (var i = 0; i < len; i++) {
        if (test == arr[i]) return false;
      }
      return true;
    };
  },

  // Joins query clauses with a logical OR returns all documents that match the conditions of either clause.
  $or: function(arr, obop) {
    if (!arr) return;
    if (!(arr instanceof Array)) arr = [arr];
    var out = [];
    arr.forEach(function(val) {
      var where = obop.where(val);
      out.push(where);
    });
    return join_or(out);
  },

  // Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
  $and: function(arr, obop) {
    if (!arr) return;
    if (!(arr instanceof Array)) arr = [arr];
    var out = [];
    arr.forEach(function(val) {
      var where = obop.where(val);
      out.push(where);
    });
    return join_and(out);
  },

  // Inverts the effect of a query expression and returns documents that do not match the query expression.
  $not: function(val, obop) {
    var where = obop.where(val);
    return function(test) {
      return !where(test);
    };
  },

  // Matches documents that have the specified field.
  $exist: function(val) {
    return function(test) {
      var exists = ('undefined' !== typeof test);
      return (exists === val);
    };
  },

  // Selects documents if the array field is a specified size.
  $size: function(val) {
    return function(test) {
      var exists = ('undefined' !== typeof test);
      if (!exists) {
        len = 0;
      } else if (!(test instanceof Array)) {
        len = 1;
      } else {
        len = test.length;
      }
      return len == val;
    };
  }
};

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
    return error('Invalid where operator type: ' + selector);
  }

  var array = [];
  var equal = {};
  var hasdot = {};
  var children = {};

  // group queries
  for (var key1 in selector) {
    var val1 = selector[key1];
    var pos1 = key1.indexOf('.');
    var gen1 = op1[key1];
    if (gen1) {
      // {"$gt": 1234}
      var f = gen1(val1, obop, key1);
      if (f) array.push(f);
    } else if (pos1 > -1) {
      // {"foo.bar": 1234}
      var pre1 = key1.substr(0, pos1);
      var post1 = key1.substr(pos1 + 1);
      hasdot[pre1] = hasdot[pre1] || {};
      hasdot[pre1][post1] = val1;
    } else if (val1 instanceof Array) {
      // {"foo": []}
      return error('Unknown where operator: ' + key1);
    } else if ('object' == typeof val1) {
      // {"foo": {}}
      children[key1] = val1;
    } else {
      // {"foo": 1234}
      equal[key1] = val1;
    }
  }

  var sckeys = Object.keys(equal);
  if (sckeys.length == 1) {
    // one equal operator (faster)
    var key = sckeys[0];
    var val = selector[key];
    var single_eq = function(item) {
      return ('object' === typeof item) && item[key] == val;
    };
    array.push(single_eq);
  } else if (sckeys.length > 1) {
    // more equal operators
    var multiple_eq = function(item) {
      if ('object' !== typeof item) return false;
      for (var key in equal) {
        if (item[key] != equal[key]) return false;
      }
      return true;
    };
    array.push(multiple_eq);
  }

  var err;
  add_children(hasdot);
  add_children(children);
  if (err) return error(err);

  // one query type used
  if (array.length < 2) {
    return array.shift() || _nop;
  }

  // more query types used
  return join_and(array);

  function add_children(hash) {
    Object.keys(hash).forEach(function(key) {
      if (err) return;
      var selector = hash[key];
      var where = obop.where(selector);
      if (!where) return;
      if (where instanceof Error) {
        err = where;
        return;
      }
      var f = function(item) {
        return where(item[key]);
      };
      if (f) array.push(f);
    });
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

function check_err(array) {
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var f = array[i];
    if (f instanceof Error) return f;
  }
}

function join_and(array) {
  var len = array.length;
  return check_err(array) || function(item) {
    for (var i = 0; i < len; i++) {
      var f = array[i];
      if (!f(item)) return false;
    }
    return true;
  };
}

function join_or(array) {
  var len = array.length;
  return check_err(array) || function(item) {
    for (var i = 0; i < len; i++) {
      var f = array[i];
      if (f(item)) return true;
    }
    return false;
  };
}

function nop(item) {
  return true;
}
