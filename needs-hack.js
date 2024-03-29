'use strict';

var GetIntrinsic = require('get-intrinsic');

var $BigInt = GetIntrinsic('%BigInt%', true);

// node v10.4-v10.8 have a bug where you can't `BigInt(x)` anything larger than MAX_SAFE_INTEGER
var needsBigIntHack = false;
if ($BigInt) {
	try {
		$BigInt(Math.pow(2, 64));
	} catch (e) {
		needsBigIntHack = true;
	}
}

/** @type {import('./needs-hack')} */
module.exports = needsBigIntHack;
