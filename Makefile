#!/usr/bin/env bash -c make

SRC=index.js lib/*.js lib/*.json

all: build/obop.min.js jsdoc build/test.browserify.js

clean:
	/bin/rm -fr build/ gh-pages/docs/

test:
	./node_modules/.bin/jshint .
	./node_modules/.bin/mocha -R spec test/*.test.js

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

.PHONY: all clean test
