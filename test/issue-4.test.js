#!/usr/bin/env mocha -R spec

var assert = require("assert").strict;
var obop = require("../");

var TITLE = "issue-4.test.js";

/* jshint mocha:true */

describe(TITLE, function() {
    it("Cannot read property 'x' of undefined", function() {
        assert.equal(obop.where({"foo.bar": "buz"})({foo: {bar: "buz"}}), true);
        assert.equal(obop.where({"foo.bar": "buz"})({}), false);
        assert.equal(obop.where({"foo": {"bar": "buz"}})({foo: {bar: "buz"}}), true);
        assert.equal(obop.where({"foo": {"bar": "buz"}})({}), false);

        assert.equal(obop.where({"foo.bar": {"$ne": "buz"}})({foo: {bar: "buz"}}), false);
        assert.equal(obop.where({"foo.bar": {"$ne": "buz"}})({}), true);
        assert.equal(obop.where({"foo": {"bar": {"$ne": "buz"}}})({foo: {bar: "buz"}}), false);
        assert.equal(obop.where({"foo": {"bar": {"$ne": "buz"}}})({}), true);
    });
});
