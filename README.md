# obop

MongoDB-like Object Operator Translators for JavaScript Array Manipulation

## SYNOPSIS

### Node.js Environment

```js
var obop = require('obop')();
var src = [ { a: 1 }, { a: 2 }, { a: 3 } ];
var func = obop.where( { a: 2 } );
var out = src.filter(func);
// => [ { a: 2 } ]
```

### Browser Envorinment

```html
<script src="obop.js"></script>
<script>
  var src = [ { a: 1 }, { a: 2 }, { a: 3 } ];
  var func = obop.where( { a: 2 } );
  var out = src.filter(func);
  // => [ { a: 2 } ]
</script>
```

## INSTALLATION

### Node.js Environment

```sh
npm install git://github.com/kawanet/obop.git
```

### Browser Environment

- Download minified version:
  https://raw.github.com/kawanet/obop/master/build/obop.min.js

## AUTHOR

- https://github.com/kawanet

## LICENCE

Copyright 2013 @kawanet

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.