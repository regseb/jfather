# JFather

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" alt="">

[![npm][img-npm]][link-npm]
[![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]
[![semver][img-semver]][link-semver]

> _Boys use JSON; Men use JFather._

## Overview

JFather is a utility library to **merge**, **extend** and **override**
[JSON](https://www.json.org/json-fr.html "JavaScript Object Notation") objects.

```JavaScript
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

// Override an object.
const overridden = await JFather.merge(
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

## Installation

JFather is published on [npm][link-npm] (its CDN:
[esm.sh](https://esm.sh/jfather),
[jsDelivr](https://www.jsdelivr.com/package/npm/jfather),
[UNPKG](https://unpkg.com/browse/jfather/)) and
[Deno](https://deno.land/x/jfather).

```JavaScript
// Node.js and Bun (after `npm install jfather`):
import JFather from "jfather";

// Browsers:
import JFather from "https://esm.sh/jfather@0";
import JFather from "https://cdn.jsdelivr.net/npm/jfather@0";
import JFather from "https://unpkg.com/jfather@0";

// Deno:
import JFather from "https://deno.land/x/jfather/mod.js";
```

## Features

### Merge

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <th><code>parent</code></th>
    <th><code>child</code></th>
    <th><code>JFather.merge(parent, child)</code></th>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>1</code></pre></td>
    <td><pre lang="JSON"><code>2</code></pre></td>
    <td><pre lang="JSON"><code>2</code></pre></td>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "foo": "alpha",
  "bar": "ALPHA"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "foo": "beta",
  "baz": "BETA"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "foo": "beta",
  "bar": "ALPHA",
  "baz": "BETA"
}</code></pre></td>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "foo": [1, 10, 11]
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "foo": [2, 20, 22]
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "foo": [2, 20, 22]
}</code></pre></td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html -->

### Extend

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <th><code>https://foo.bar/parent.json</code></th>
    <th><code>child</code></th>
    <th><code>await JFather.extend(child)</code></th>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "baz": "qux"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "$extends": "https://foo.bar/parent.json"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "baz": "qux"
}</code></pre></td>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "baz": "qux"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "$extends": "https://foo.bar/parent.json",
  "baz": "quux"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "baz": "quux"
}</code></pre></td>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "baz": "qux"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "$extends": "https://foo.bar/parent.json",
  "quux": "corge"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "baz": "qux",
  "quux": "corge"
}</code></pre></td>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "baz": "qux"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "quux": {
    "$extends": "https://foo.bar/parent.json",
    "corge": "grault"
  }
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "quux": {
    "baz": "qux",
    "corge": "grault"
  }
}</code></pre></td>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "baz": {
    "qux": [1, 2],
    "quux": "a"
  },
  "corge": true
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "$extends": "https://foo.bar/parent.json#baz"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "qux": [1, 2],
  "quux": "a"
}</code></pre></td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html -->

### Override

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <th><code>parent</code></th>
    <th><code>child</code></th>
    <th><code>JFather.merge(parent, child)</code></th>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "foo": ["a", "Alpha"]
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "$foo[]": ["b", "Beta"]
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "foo": ["a", "Alpha", "b", "Beta"]
}</code></pre></td>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "foo": ["a", "Alpha"]
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "$foo[0]": "A"
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "foo": ["A", "Alpha"]
}</code></pre></td>
  </tr>
  <tr>
    <td><pre lang="JSON"><code>{
  "foo": [{ "bar": ["a"] }]
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "$foo[0]": { "$bar[]": ["b", "c"] }
}</code></pre></td>
    <td><pre lang="JSON"><code>{
  "foo": [{ "bar": ["a", "b", "c"] }]
}</code></pre></td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html -->

## API

- [`merge()`](#merge)
- [`extend()`](#extend)
- [`load()`](#load)
- [`parse()`](#parse)

### `merge()`

Merge and override `parent` with `child`.

```JavaScript
JFather.merge(parent, child);
```

- Parameters:
  - `parent`: The parent object.
  - `child`: The child object.
- Returns: The merged object.

### `extend()`

Extend `obj`, merge and override.

```JavaScript
JFather.extend(obj);
```

- Parameter:
  - `obj`: The object with any `$extends` properties.
- Returns: A promise with the extended object.

### `load()`

Load from a `url`, extend, merge and override.

```JavaScript
JFather.load(url);
```

- Parameter:
  - `url`: The string containing the URL of a JSON file.
- Returns: A promise with the loaded object.

### `parse()`

Parse a `text`, extend, merge and override.

```JavaScript
JFather.parse(text);
```

- Parameter:
  - `text`: The string containing a JSON object.
- Returns: A promise with the parsed object.

[img-npm]: https://img.shields.io/npm/dm/jfather?label=npm&logo=npm&logoColor=whitesmoke
[img-build]: https://img.shields.io/github/actions/workflow/status/regseb/jfather/ci.yml?branch=main&logo=github&logoColor=whitesmoke
[img-coverage]: https://img.shields.io/endpoint?label=coverage&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fjfather%2Fmain&logo=stryker&logoColor=whitesmoke
[img-semver]: https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&logoColor=whitesmoke
[link-npm]: https://www.npmjs.com/package/jfather
[link-build]: https://github.com/regseb/jfather/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]: https://dashboard.stryker-mutator.io/reports/github.com/regseb/jfather/main
[link-semver]: https://semver.org/spec/v2.0.0.html "Semantic Versioning 2.0.0"
