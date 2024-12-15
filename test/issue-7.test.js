#!/usr/bin/env mocha -R spec

/* jshint esversion:6 */
/* jshint proto:true */

const assert = require("assert").strict;
const obop = require("../");

const TITLE = "issue-7.test.js";

/**
 * Prototype pollution found in view.js
 * https://github.com/kawanet/obop/issues/7
 */

describe(TITLE, () => {
  it("Invalid target: __proto__ at order()", () => {
    const fn = obop.order({foo: 1});
    assert.deepEqual([{foo: 2}, {foo: 1}, {foo: 3}].sort(fn), [{foo: 1}, {foo: 2}, {foo: 3}]); // OK

    assert.throws(() => obop.order({"__proto__.foo": 1}), "should throw for `__proto__.foo`");
  });

  it("Invalid target: __proto__ at update()", () => {
    const fn = obop.update({$set: {foo: "FOO"}});
    assert.deepEqual(fn({bar: "BAR"}), {foo: "FOO", bar: "BAR"}); // OK

    const obj = Object.create(null);
    obj.__proto__ = {foo: "FOO"};
    assert.throws(() => obop.update({$set: obj}), "should throw for `__proto__`");

    assert.throws(() => obop.update({$set: {"__proto__.foo": "FOO"}}), "should throw for `__proto__.foo`");
    assert.equal({}.foo, undefined, "The global Object prototype should not be polluted");

    assert.throws(() => obop.update({$set: {"bar.__proto__.buz": "BUZ"}}), "should throw for `bar.__proto__.buz`");
    assert.equal({}.buz, undefined, "The global Object prototype should not be polluted");
  });

  it("Invalid target: __proto__ at view()", () => {
    const fn = obop.view({"foo.bar": 1});
    assert.deepEqual(fn({foo: {bar: "BAR", buz: "BUZ"}}), {foo: {bar: "BAR"}}); // OK

    const obj = Object.create(null);
    obj.__proto__ = 1;
    assert.throws(() => obop.view(obj), "should throw for `__proto__`");

    assert.throws(() => obop.view({"__proto__.foo": "FOO"}), "should throw for `__proto__.foo`");
    assert.equal({}.foo, undefined, "The global Object prototype should not be polluted");

    assert.throws(() => obop.view({"bar.__proto__.buz": "BUZ"}), "should throw for `bar.__proto__.buz`");
    assert.equal({}.buz, undefined, "The global Object prototype should not be polluted");
  });

  it("Invalid target: __proto__ at where()", () => {
    {
      const fn = obop.where({"foo": "FOO"});
      assert.equal(fn({}), false);
      assert.equal(fn({foo: "FOO"}), true);
    }

    const obj = Object.create(null);
    obj.__proto__ = {foo: "FOO"};
    assert.throws(() => obop.where(obj), "should throw for `__proto__`");

    assert.throws(() => obop.where({"__proto__.foo": "FOO"}), "should throw for `__proto__.foo`");
    assert.equal({}.foo, undefined, "The global Object prototype should not be polluted");

    assert.throws(() => obop.where({"bar.__proto__.buz": "BUZ"}), "should throw for `bar.__proto__.buz`");
    assert.equal({}.buz, undefined, "The global Object prototype should not be polluted");
  });
});
