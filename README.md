# obop

[![npm version](https://badge.fury.io/js/obop.svg)](https://www.npmjs.com/package/obop) 
[![Node.js CI](https://github.com/kawanet/obop/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/kawanet/obop/actions/)
[![gzip size](https://img.badgesize.io/https://unpkg.com/obop/build/obop.min.js?compression=gzip)](https://unpkg.com/obop/build/obop.min.js)

MongoDB-style object operators makes array manipulation easy: where/order/update/view

## SYNOPSIS

```js
import obop from "obop";

const array = [{a: 1}, {a: 2}, {a: 3}];

const out = obop.where(array, {a: 2}); // => [ { a: 2 } ]

const out = array.filter(obop.where({a: 2})); // => [ { a: 2 } ]
```

Alternatively, you can generate the original `obop` function via the default export.

```js
import obopInit from "obop";

const obop = obopInit();

const out = obop.where(array, {a: 2}); // => [ { a: 2 } ]
```

### CommonJS

```js
const obop = require('obop')();

const out = obop.where(array, {a: 2}); // => [ { a: 2 } ]
```

### Browser Environment

```html
<script src="obop.min.js"></script>
<script>
    const array = [{a: 1}, {a: 2}, {a: 3}];
    const out = obop.where(array, {a: 2}); // => [ { a: 2 } ]
</script>
```

Download [obop.min.js](https://cdn.jsdelivr.net/npm/obop/build/obop.min.js) browser build of this module.

## METHODS

See [document](http://kawanet.github.io/obop/docs/obop.html) for more detail.

### Query Selectors

[where()](http://kawanet.github.io/obop/docs/obop.html#where) method supports the following query selectors:

```js
{ field: value }                            // equal to
{ field: { $gt: value } }                   // greater than
{ field: { $gte: value } }                  // greater than or equal to
{ field: { $in: [value1, value2, ... ] } }  // in
{ field: { $lt: value } }                   // less than
{ field: { $lte: value } }                  // less than or equal to
{ field: { $ne: value } }                   // not equal to
{ field: { $nin: [ value1, value2 ... ]} }  // not in
{ $or: [ { query1 }, { qury2 }, ... ] }     // logical OR
{ $and: [ { query1 }, { query2 }, ... ] }   // logical AND
{ field: { $not: { query } } }              // not
{ field: { $exists: boolean } }             // exists
{ field: { $size: value } }                 // array size
```

Example:

```js
const out1 = obop.where(array1, {genre: 'fruit', price: {$gt: 100, $gt: 200}});
const out2 = obop.where(array2, {'review.score': {$gte: 4.0}});

// OR
const out1 = array1.filter(obop.where({genre: 'fruit', price: {$gt: 100, $gt: 200}}));
const out2 = array2.filter(obop.where({'review.score': {$gte: 4.0}}));
```

### Sort Parameters

[order()](http://kawanet.github.io/obop/docs/obop.html#order) method supports the following styles of sort parameters:

```js
{ field: 1 }                                // ascending
{ field: -1 }                               // descending
{ field1: 1, field2: -1, ... }              // combination
[ [ 'field1', 1 ], [ 'field2', -1 ], ... ]  // array style
```

Example:

```js
obop.order(array1, {price: 1, stock: -1});
obop.order(array2, [['price', 1], ['stock', -1]]); // same as above

// OR
array1.sort(obop.order({price: 1, stock: -1}));
array2.sort(obop.order([['price', 1], ['stock', -1]])); // same as above
```

### Update Operators

[update()](http://kawanet.github.io/obop/docs/obop.html#update) method supports the following update operators:

```js
{ $set: { field: value } }                  // set value
{ $unset: { field: '' } }                   // remove field
{ $rename: { oldname: newname } }           // rename field
{ $inc: { field: amount } }                 // increment value
{ $pull: { field: query } }                 // remove item from array
{ $push: { field: value } }                 // add item to array
```

Example:

```js
obop.update(array1, {$inc: {stock: -1}, $set: {'review.score': 4}});
obop.update(array2, {$unset: {order: ''}});

// OR
array1.forEach(obop.update({$inc: {stock: -1}, $set: {'review.score': 4}}));
array2.forEach(obop.update({$unset: {order: ''}}));
```

### Projection Parameters

[view()](http://kawanet.github.io/obop/docs/obop.html#view) method supports the following styles of projection parameters:

```js
{ field1: 1 }                               // output fields1 only
{ field1: 1, field2: 1, ... }               // output fields1, 2 and more
{ field1: 0 }                               // output all fields except for fields1
{ field1: 0, field2: 0, ... }               // except fields1, 2 and more
```

Example:

```js
const out1 = obop.view(array1, {name: 1, price: 1, stock: 1});  // include fields
const out2 = obop.view(array2, {_id: 0, secret: 0});            // exclude fields

// OR
const out1 = array1.map(obop.view({name: 1, price: 1, stock: 1}));  // include fields
const out2 = array2.map(obop.view({_id: 0, secret: 0}));            // exclude fields
```

## LINKS

- https://cdn.jsdelivr.net/npm/obop/build/obop.min.js
- https://github.com/kawanet/obop
- https://www.npmjs.com/package/obop

## LICENCE

Copyright 2013-2024 @kawanet

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
