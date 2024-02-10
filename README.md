# JFather

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="asset/logo.svg" align="right" alt="">

[![npm][img-npm]][link-npm]
[![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]
[![semver][img-semver]][link-semver]

> Boys use JSON; Men use JFather.

## Overview

**JFather** is
[JSON](https://www.json.org/json-fr.html "JavaScript Object Notation") with
features to merge, extend and override JSON objects.

```JavaScript
import JFather from "jfather";

const merged = JFather.merge(
    { foo: "a", bar: "alpha" },
    { foo: "b", baz: "beta" },
);

console.log(merged);
// { foo: "b", bar: "alpha", baz: "beta" }
```

## Install

### Node.js

JFather is published on [npm][link-npm].

```JavaScript
import JFather from "jfather";
```

### Deno

The library is available in [Deno](https://deno.land/x/jfather).

```JavaScript
import JFather from "https://deno.land/x/jfather/mod.js";
```

### Browsers

It can also be accessed directly from the CDN
[esm.sh](https://esm.sh/jfather) (ou
[jsDelivr](https://www.jsdelivr.com/package/npm/jfather),
[UNPKG](https://unpkg.com/browse/jfather/)) :

```JavaScript
import JFather from "https://esm.sh/jfather@0";
// import JFather from "https://cdn.jsdelivr.net/npm/jfather@0";
// import JFather from "https://unpkg.com/jfather@0";
```

## API

- [`merge()`](#merge)
- [`load()`](#load)
- [`parse()`](#parse)

### merge()

Merge two variables.

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr>
    <th><code>a</code></th>
    <th><code>b</code></th>
    <th><code>JFather.merge(a, b)</code></th>
  </tr>
  <tr>
    <td><code>1</code></td>
    <td><code>2</code></td>
    <td><code>2</code></td>
  </tr>
  <tr>
    <td><code>{ foo: "alpha", bar: "ALPHA" }</code></td>
    <td><code>{ foo: "beta", baz: "BETA" }</code></td>
    <td><code>{ foo: "beta", bar: "ALPHA", baz: "BETA" }</code></td>
  </tr>
  </tr>
  <tr>
    <td><code>{ foo: [1, 10, 11] }</code></td>
    <td><code>{ foo: [2, 20, 22] }</code></td>
    <td><code>{ foo: [2, 20, 22] }</code></td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html -->

### load()

Load an object from an URL.

### parse()

Parse a string.

[img-npm]: https://img.shields.io/npm/dm/jfather?label=npm&logo=npm&logoColor=whitesmoke
[img-build]: https://img.shields.io/github/actions/workflow/status/regseb/jfather/ci.yml?branch=main&logo=github&logoColor=whitesmoke
[img-coverage]: https://img.shields.io/endpoint?label=coverage&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fjfather%2Fmain&logo=stryker&logoColor=whitesmoke
[img-semver]: https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&logoColor=whitesmoke
[link-npm]: https://www.npmjs.com/package/jfather
[link-build]: https://github.com/regseb/jfather/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]: https://dashboard.stryker-mutator.io/reports/github.com/regseb/jfather/main
[link-semver]: https://semver.org/spec/v2.0.0.html "Semantic Versioning 2.0.0"
