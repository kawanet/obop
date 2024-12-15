#!/usr/bin/env bash -c make

CJS_TEST=test/*.test.js
ESM_DEST=build/obop.mjs
ESM_TEST=build/test.mjs

SRC=index.js lib/*.js lib/*.json

all: build/obop.min.js jsdoc build/test.browser.js $(ESM_DEST)

clean:
	/bin/rm -fr build/ gh-pages/docs/

test: $(ESM_TEST)
	./node_modules/.bin/jshint .
	./node_modules/.bin/mocha -R spec test/*.test.js
	./node_modules/.bin/mocha -R spec $(ESM_TEST)

lib/system.json: package.json
	node -e 'require("fs").writeFileSync("lib/system.json", JSON.stringify(require("./").view({name:1, version:1})(require("./package.json")), null, 2))'

build/obop.browser.js: $(SRC) Makefile
	./node_modules/.bin/rollup $< --file $@ --format iife --name obop \
	--plugin @rollup/plugin-commonjs \
	--plugin @rollup/plugin-json \
	--plugin @rollup/plugin-node-resolve \

build/obop.min.js: build/obop.browser.js
	./node_modules/.bin/terser --compress --mangle --output $@ --comments false -- $<

build/test.browser.js: $(CJS_TEST) build/assert.browser.js Makefile
	./node_modules/.bin/rollup $(CJS_TEST) --format iife \
	--plugin @rollup/plugin-commonjs \
	--plugin @rollup/plugin-json \
	--plugin @rollup/plugin-multi-entry \
	--plugin @rollup/plugin-node-resolve \
	--external 'assert,../' |\
	perl -pe 's#^}\)\(require.*\);#})(assert, obop)#' > $@

build/assert.browser.js: ./node_modules/assert/assert.js Makefile
	./node_modules/.bin/rollup $< --file $@ --format iife --name assert \
	--plugin @rollup/plugin-commonjs \
	--plugin @rollup/plugin-node-resolve='{"browser":true, "preferBuiltins":false}'

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
