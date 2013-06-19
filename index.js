/*! index.js */

/**
 * This class provides translation methods for MongoDB-like operator objects.
 *
 * @class obop
 * @property {String} system.name - Read only. System name: "obop"
 * @property {String} system.version - Read only. System version: e.g. "0.0.1"
 * @property {Bool} settings.nop - Set this true if you prefer a through function returned, instead of null value returned per default, in a case of no operations applied.
 * @property {Bool} settings.throwError - Set this true if you prefer throwing an exception, instead of an Error instance returned per default, in a case of something wrong found.
 *
 * @example
 * // node.js
 * var obop = require('obop')();
 * var src = [ { a: 1 }, { a: 2 }, { a: 3 } ];
 * var func = obop.where( { a: 2 } );
 * var out = src.filter(func); // ==> [ { a: 2 } ]
 *
 * @example
 * &lt;script src="obop.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *   var src = [ { a: 1 }, { a: 2 }, { a: 3 } ];
 *   var func = obop.where( { a: 2 } );
 *   var out = src.filter(func); // ==> [ { a: 2 } ]
 * &lt;/script&gt;
 */

function obop() {
  if (!(this instanceof obop)) return new obop();
  this.settings = {};
}

function system() {
  if (!(this instanceof system)) return new system();
}

system.prototype = require('./lib/system.json');

obop.where = obop.prototype.where = require('./lib/where.js').where;
obop.view = obop.prototype.view = require('./lib/view.js').view;
obop.order = obop.prototype.order = require('./lib/order.js').order;
obop.update = obop.prototype.update = require('./lib/update.js').update;
obop.system = obop.prototype.system = new system();
obop.settings = obop.prototype.settings = {};

module.exports = obop;
