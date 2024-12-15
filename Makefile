#!/usr/bin/env bash -c make

CJS_TEST=test/*.test.js
ESM_DEST=build/obop.mjs
ESM_TEST=build/test.mjs

SRC=index.js lib/*.js lib/*.json

all: build/obop.min.js jsdoc build/test.browserify.js $(ESM_DEST)

clean:
	/bin/rm -fr build/ gh-pages/docs/

test: $(ESM_TEST)
	./node_modules/.bin/jshint .
	./node_modules/.bin/mocha -R spec test/*.test.js
	./node_modules/.bin/mocha -R spec $(ESM_TEST)

lib/system.json: package.json
	node -e 'require("fs").writeFileSync("lib/system.json", JSON.stringify(require("./").view({name:1, version:1})(require("./package.json")), null, 2))'

build/obop.browserify.js: $(SRC)
	./node_modules/.bin/browserify --list index.js
	./node_modules/.bin/browserify -s obop index.js -o $@

build/test.browserify.js: $(SRC) test/*.js
	./node_modules/.bin/browserify test/*.js -o $@ -t [ browserify-sed "s#require\(.\.\./.\)#require('../browser/import')#g" ]

build/obop.min.js: build/obop.browserify.js
	./node_modules/.bin/terser --compress --mangle --output $@ --comments false -- $<

jsdoc: $(SRC)
	./node_modules/.bin/jsdoc -d gh-pages/docs index.js lib/*.js

#### ES Module

$(ESM_DEST): $(SRC) Makefile
	./node_modules/.bin/rollup $< --file $@ --format esm \
	--plugin @rollup/plugin-commonjs \
	--plugin @rollup/plugin-json \
	--plugin @rollup/plugin-node-resolve \

$(ESM_TEST): $(CJS_TEST) Makefile
	./node_modules/.bin/rollup $(CJS_TEST) --format esm \
	--plugin @rollup/plugin-commonjs \
	--plugin @rollup/plugin-json \
	--plugin @rollup/plugin-multi-entry \
	--plugin @rollup/plugin-node-resolve \
	--external 'assert,../' |\
	perl -pe 's#^(import require.*? from .)/.*(.;)#$$1./obop.mjs$$2#' > $@

####

.PHONY: all clean test
