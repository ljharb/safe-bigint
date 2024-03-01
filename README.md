# safe-bigint <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

Safely create a BigInt from a numerical string, even one larger than `MAX_SAFE_INTEGER`.

Note that the implementation in node versions that lack the `exports` field, or bundlers/tooling that does not understand it, will use `Function`, which in browsers, may not work due to CSP controls.

However, the modern version (which modern node and bundlers/tooling should all detect) just exports the `BigInt` constructor.
Feel free to alias this package with `module.exports = BigInt` or `export default BigInt` in your build process configuration.

## Example

```js
const safeBigInt = require('safe-bigint');
const assert = require('assert');
const { satisfies } = require('semver');

assert.equal(9007199254740991n, safeBigInt(9007199254740991));
assert.equal(9007199254740992n, safeBigInt(9007199254740992));

if (satisfies(process.version, '10.4 - 10.8')) {
    assert.throws(
        () => BigInt(9007199254740992),
        RangeError
    );
}
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/safe-bigint
[npm-version-svg]: https://versionbadg.es/ljharb/safe-bigint.svg
[deps-svg]: https://david-dm.org/ljharb/safe-bigint.svg
[deps-url]: https://david-dm.org/ljharb/safe-bigint
[dev-deps-svg]: https://david-dm.org/ljharb/safe-bigint/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/safe-bigint#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/safe-bigint.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/safe-bigint.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/safe-bigint.svg
[downloads-url]: https://npm-stat.com/charts.html?package=safe-bigint
[codecov-image]: https://codecov.io/gh/ljharb/safe-bigint/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/safe-bigint/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/safe-bigint
[actions-url]: https://github.com/ljharb/safe-bigint/actions
