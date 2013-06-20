# obop

MongoDB-style object operators makes array manipulation easy: where/order/update/view

## SYNOPSIS

### Node.js Environment

```js
var obop = require('obop')();
var src = [ { a: 1 }, { a: 2 }, { a: 3 } ];
var out = obop.where( src, { a: 2 } ); // => [ { a: 2 } ]
```

### Browser Envorinment

```html
<script src="obop.min.js"></script>
<script>
  var src = [ { a: 1 }, { a: 2 }, { a: 3 } ];
  var out = obop.where( src, { a: 2 } ); // => [ { a: 2 } ]
</script>
```

## METHODS

### Query Selectors

[where()](http://kawanet.github.io/obop/docs/obop.html#where) method supports the following query selectors:

```js
{ field: value }
{ field: { $gt: value } }
{ field: { $gte: value } }
{ field: { $in: [value1, value2, ... ] } }
{ field: { $lt: value } }
{ field: { $lte: value } }
{ field: { $ne: value } }
{ field: { $nin: [ value1, value2 ... ]} }
{ $or: [ { query1 }, { query2 }, ... ] }
{ $and: [ { query1 }, { query2 }, ... ] }
{ field: { $not: { query } } }
{ field: { $exists: boolean } }
{ field: { $size: value } }
```

Example:

```js
var out = obop.where( src, { genre: "fruit", price: { $lt: 100 }, "review.score": { $gte: 4.0 } } );
```

### Sort Parameters

[order()](http://kawanet.github.io/obop/docs/obop.html#order) method supports the following styles of sort parameters:

```js
{ field: 1 } // ascending
{ field: -1 } // descending
{ field1: 1, field2: -1 } // combination
[ [ "field1", 1 ], [ "field2", -1 ] ] // array style
```

Example:

```js
var out1 = obop.order( src1, { price: 1, stock: -1 } );
var out2 = obop.order( src2, [[ "price", 1], ["stock", -1]] );
```

### Update Operators

[update()](http://kawanet.github.io/obop/docs/obop.html#update) method supports the following update operators:

```js
{ $set: { field: value } }
{ $unset: { field: "" } }
{ $rename: { oldname: newname } }
{ $inc: { field: amount } }
{ $pull: { field: query } }
{ $push: { field: value } }
```

Example:

```js
var out1 = obop.order( src1, { $inc: { stock: -1 }, $set: { "review.score": 4 } } );
var out2 = obop.order( src2, { $unset: { order: "" },  } );
```

### Projection Parameters

[view()](http://kawanet.github.io/obop/docs/obop.html#view) method supports the following styles of projection parameters:

```js
{ field1: 1 } // output fields1 only
{ field1: 1, field2: 1, ... } // include fields1, 2 and more
{ field1: 0 } // output all fields except for fields1
{ field1: 0, field2: 0, ... } // exclude fields1, 2 and more
```

Example:

```js
var out1 = obop.view( src1, { name: 1, price: 1, stock: 1 } );
var out2 = obop.view( src2, { _id: 0, secret: 0 } );
```

## INSTALLATION

```sh
npm install http://git@github.com:kawanet/obop.git
```

## LINKS

### Browser Build

https://raw.github.com/kawanet/obop/master/build/obop.min.js

### Documentation

http://kawanet.github.io/obop/docs/obop.html

### Sources

https://github.com/kawanet/obop

### Author

https://github.com/kawanet

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
