'use strict';

var GetIntrinsic = require('get-intrinsic');

/** @type {import('./modern')} */
module.exports = GetIntrinsic('%BigInt%', true);
