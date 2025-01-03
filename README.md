# JFather

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" alt="">

[![npm][img-npm]][link-npm] [![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage] [![semver][img-semver]][link-semver]

> _Boys use JSON; Men use JFather._

## Overview

JFather is a
[JSON](https://www.json.org/json-en.html "JavaScript Object Notation") utility
library to:

- [**merge**](#merge) deeply two JSON objects.
- [**extend**](#extend) a JSON objects with `"$extends"` property.
- [**override**](#override) an array with `"$foo[0]"` (replace a value) or
  `"$foo[]"` (append values) properties.

<!-- prettier-ignore-start -->
```javascript
import JFather from "jfather";

// Merge two objects.
const merged = JFather.merge(
  { "foo": "a", "bar": "alpha" },
  { "foo": "b", "baz": "beta" }
);
console.log(merged);
// { "foo": "b", "bar": "alpha", "baz": "beta" }

// Extend an object.
const extended = await JFather.extend({
  "$extends": "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json#members[1]",
  "age": 34,
  "quote": "With great fist comes great KO"
});
console.log(extended);
// {
//   "name": "Madame Uppercut",
//   "age": 34,
//   "secretIdentity": "Jane Wilson",
//   "powers": [
//     "Million tonne punch",
//     "Damage resistance",
//     "Superhuman reflexes"
//   ],
//   "quote": "With great fist comes great KO"
// }

// Override arrays of an object.
const overridden = JFather.merge(
  { "foo": ["a", "alpha"] },
  { "$foo[0]": "A", "$foo[]": ["BETA"] }
);
console.log(overridden);
// {
//   "foo": ["A", "alpha", "BETA"]
// }

// Extend, merge and override an object.
const allIn = await JFather.extend({
  "$extends": "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json#members[0]",
  "age": 27,
  "$powers[2]": "Atomic breath",
  "$powers[]": ["Matter Creation", "Reality Warping"],
  "quote": "I'm no God. I'm not even a man. I'm just Molecule Man."
});
console.log(allIn);
// {
//   "name": "Molecule Man",
//   "age": 27,
//   "secretIdentity": "Dan Jukes",
//   "powers": [
//     "Radiation resistance",
//     "Turning tiny",
//     "Atomic breath",
//     "Matter Creation",
//     "Reality Warping
//   ],
//   "quote": "I'm no God. I'm not even a man. I'm just Molecule Man."
// }
```
<!-- prettier-ignore-end -->

## Installation

JFather is published on [npm][link-npm] (its CDN:
[esm.sh](https://esm.sh/jfather),
[jsDelivr](https://www.jsdelivr.com/package/npm/jfather),
[UNPKG](https://unpkg.com/browse/jfather/)),
[JSR](https://jsr.io/@regseb/jfather) and [Deno](https://deno.land/x/jfather).

```javascript
// Node.js and Bun (after `npm install jfather`):
import JFather from "jfather";

// Browsers:
import JFather from "https://esm.sh/jfather@0";
import JFather from "https://cdn.jsdelivr.net/npm/jfather@0";
import JFather from "https://unpkg.com/jfather@0";

// Deno (after `deno add jsr:@regseb/jfather`):
import JFather from "jsr:@regseb/jfather";
```

## Features

### Merge

With any two variable types (except objects), merge returns the value of the
child. The following example shows how to use it with numbers: the result is `2`
(retrieved from the child value).

```javascript
const parent = 1;
const child = 2;
console.log(JFather.merge(parent, child));
// 2
```

If both variables are objects, the object properties are merged one by one. In
this example, the `"foo"` property overwrites that of the parent. The properties
`"bar"` and `"baz"` are simply copied, as they are only in either the parent or
the child.

<!-- prettier-ignore-start -->
```javascript
const parent = { "foo": "alpha", "bar": "ALPHA" };
const child  = { "foo": "beta", "baz": "BETA" };
console.log(JFather.merge(parent, child));
// { "foo": "beta", "bar": "ALPHA", "baz": "BETA" }
```
<!-- prettier-ignore-end -->

Merging is done recursively. The following example shows the merging of two
objects, which in turn contains the merging of the `"foo"` sub-objects.

<!-- prettier-ignore-start -->
```javascript
const parent = {
  "foo": { "bar": 1, "baz": 2 },
  "qux": "a"
};
const child = {
  "foo": { "bar": 10, "quux": 20 },
  "corge": "b"
};
console.log(JFather.merge(parent, child));
// {
//   "foo": { "bar": 10, "baz": 2, "quux": 20 },
//   "qux": "a",
//   "corge": "b"
// }
```
<!-- prettier-ignore-end -->

Arrays are processed like any other type: the value of the child overrides that
of the parent. For more detailed merging, see the [_Override_](#override)
chapter, which shows how to merge arrays.

<!-- prettier-ignore-start -->
```javascript
const parent = { "foo": [1, 10, 11] };
const child  = { "foo": [2, 20, 22] };
console.log(JFather.merge(parent, child));
// { "foo": [2, 20, 22] }
```
<!-- prettier-ignore-end -->

### Extend

You can extend an object using the `"$extends"` property, which must link to a
JSON file. The remote JSON file and the current object will be merged.

In this example, the child object is empty (except for the `"$extends"`
property). The result therefore contains the parent object.

<!-- prettier-ignore-start -->
```javascript
// https://example.com/parent.json
// { "foo": 42 }

const obj = { "$extends": "https://example.com/parent.json" };
console.log(await JFather.extend(obj));
// { "foo": 42 }
```
<!-- prettier-ignore-end -->

As with merge, if a property is in both parent and child, the child's value is
used. Otherwise, both parent and child properties are added to the result.

<!-- prettier-ignore-start -->
```javascript
// https://example.com/parent.json
// { "foo": "A", "bar": "Alpha" }

const obj = {
  "$extends": "https://example.com/parent.json",
  "foo": "B",
  "baz": "Beta"
};
console.log(await JFather.extend(obj));
// { "foo": "B", "bar": "Alpha", "baz": "Beta" }
```
<!-- prettier-ignore-end -->

It is possible to extend a child's sub-object. In the example below, the parent
is merged with the child's `"bar"` sub-object.

<!-- prettier-ignore-start -->
```javascript
// https://example.com/parent.json
// { "foo": 42 }

const obj = {
  "bar": {
    "$extends": "https://example.com/parent.json",
    "baz": 3.14
  }
};
console.log(await JFather.extend(obj));
// {
//   "bar": { "foo": 42, "baz": 3.14 }
// }
```
<!-- prettier-ignore-end -->

In the parent link, you can define a path to retrieve a sub-object from the
parent. The path is set in the URL hash:

- `#foo`: the value of the `"foo"` property;
- `#foo.bar`: the value of the `"bar"` sub-property in the `"foo"` property;
- `#foo[42]`: the value of the forty-third array element in the `"foo"`
  property;
- `#foo[0].bar`: the value of the sub-property `"bar"` in the first element of
  the array in the property `"foo"`.

This example merges the `"foo"` property of the parent with the child.

<!-- prettier-ignore-start -->
```javascript
// https://example.com/parent.json
// {
//   "foo": { "bar": [1, 2], "baz": "a" },
//   "qux": true
// }

const obj = { "$extends": "https://example.com/parent.json#foo" };
console.log(await JFather.extend(obj));
// { "bar": [1, 2], "baz": "a" }
```
<!-- prettier-ignore-end -->

### Override

If an object has arrays, the merge overwrites the parent's array with the
child's. With the properties `"$foo[42]"` and `"$foo[]"`, you can refine the
merge.

In this example, the array `"foo"` is not overwritten. The first value of the
`"foo"` array is merged with the value of the child's `"$foo[0]"` property. And
the second value of `"foo"` is copied into the result.

<!-- prettier-ignore-start -->
```javascript
const parent = { "foo": ["a", "Alpha"] };
const child  = { "$foo[0]": "B" };
console.log(JFather.merge(parent, child));
// { "foo": ["B", "Alpha"] }
```
<!-- prettier-ignore-end -->

With `"$foo[]"`, the child's values are added to those of the parent. In the
example below, the values `"b"` and `"Beta"` are added to the array of the
`"foo"` property.

<!-- prettier-ignore-start -->
```javascript
const parent = { "foo": ["a", "Alpha"] };
const child  = { "$foo[]": ["b", "Beta"] };
console.log(JFather.merge(parent, child));
// { "foo": ["a", "Alpha", "b", "Beta"] }
```
<!-- prettier-ignore-end -->

You can combine the two overloads to, for example:

- merge the first value of the parent's `"foo"` array with the value of the
  child's `"$foo[0]"` property;
- add the values `"b"` and `"c"` to the array of the sub-property `"bar"`.

<!-- prettier-ignore-start -->
```javascript
const parent = {
  "foo": [{
    "bar": ["a"]
  }]
};
const child = {
  "$foo[0]": {
    "$bar[]": ["b", "c"]
  }
};
console.log(JFather.merge(parent, child));
// {
//   "foo": [{
//     "bar": ["a", "b", "c"]
//   }]
// }
```
<!-- prettier-ignore-end -->

If the child overloads a property that does not exist in the parent, the
overload is ignored. The overload is also ignored if the parent object is not an
array. In the following example, the child has two overloads which are ignored:
the overload on the property `"bar"` which is not an array, and the overload on
`"baz"` which does not exist in the parent.

<!-- prettier-ignore-start -->
```javascript
const parent = { "foo": ["a", "A"], "bar": 42 };
const child  = { "$bar[0]": 3.14, "$baz[]": ["beta"] };
console.log(JFather.merge(parent, child));
// { "foo": ["a", "A"], "bar": 42 }
```
<!-- prettier-ignore-end -->

## API

- [`JFather.merge(parent, child)`](#jfathermergeparent-child)
- [`JFather.extend(obj, [options])`](#jfatherextendobj-options)
- [`JFather.load(url, [options])`](#jfatherloadurl-options)
- [`JFather.parse(text, [options])`](#jfatherparsetext-options)

### `JFather.merge(parent, child)`

Merge and override `parent` with `child`.

- Parameters:
  - `parent` [`<any>`][mdn-any] The parent object.
  - `child` [`<any>`][mdn-any] The child object.
- Returns: [`<any>`][mdn-any] The merged object.

### `JFather.extend(obj, [options])`

Extend `obj`, merge and override.

- Parameter:
  - `obj` [`<any>`][mdn-any] The object with any `$extends` properties.
  - `options` [`<Object>`][mdn-object]
    - `request` [`<Function>`][mdn-function] The function for getting a JSON
      object remotely. By default, the object is got with [`fetch()`][mdn-fetch]
      and [`Response.json()`][mdn-response-json].
- Returns: [`<Promise>`][mdn-promise] A promise with the extended object.

### `JFather.load(url, [options])`

Load from an `url`, extend, merge and override.

- Parameter:
  - `url` [`<String>`][mdn-string] | [`<URL>`][mdn-url] The string containing
    the URL of a JSON file.
  - `options` [`<Object>`][mdn-object]
    - `request` [`<Function>`][mdn-function] The function for getting a JSON
      object remotely. By default, the object is got with [`fetch()`][mdn-fetch]
      and [`Response.json()`][mdn-response-json].
- Returns: [`<Promise>`][mdn-promise] A promise with the loaded object.

### `JFather.parse(text, [options])`

Parse a `text`, extend, merge and override.

- Parameter:
  - `text` [`<String>`][mdn-string] The string containing a JSON object.
  - `options` [`<Object>`][mdn-object]
    - `request` [`<Function>`][mdn-function] The function for getting a JSON
      object remotely. By default, the object is got with [`fetch()`][mdn-fetch]
      and [`Response.json()`][mdn-response-json].
- Returns: [`<Promise>`][mdn-promise] A promise with the parsed object.

[mdn-any]: https://developer.mozilla.org/Web/JavaScript/Data_structures
[mdn-function]:
  https://developer.mozilla.org/JavaScript/Reference/Global_Objects/Function
[mdn-object]:
  https://developer.mozilla.org/JavaScript/Reference/Global_Objects/Object
[mdn-promise]:
  https://developer.mozilla.org/JavaScript/Reference/Global_Objects/Promise
[mdn-string]:
  https://developer.mozilla.org/JavaScript/Reference/Global_Objects/String
[mdn-fetch]: https://developer.mozilla.org/Web/API/fetch
[mdn-response-json]: https://developer.mozilla.org/Web/API/Response/json
[mdn-url]: https://developer.mozilla.org/Web/API/URL
[img-npm]:
  https://img.shields.io/npm/dm/jfather?label=npm&logo=npm&logoColor=whitesmoke
[img-build]:
  https://img.shields.io/github/actions/workflow/status/regseb/jfather/ci.yml?branch=main&logo=github&logoColor=whitesmoke
[img-coverage]:
  https://img.shields.io/endpoint?label=coverage&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fjfather%2Fmain
[img-semver]:
  https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&logoColor=whitesmoke
[link-npm]: https://www.npmjs.com/package/jfather
[link-build]:
  https://github.com/regseb/jfather/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]:
  https://dashboard.stryker-mutator.io/reports/github.com/regseb/jfather/main
[link-semver]: https://semver.org/spec/v2.0.0.html "Semantic Versioning 2.0.0"
