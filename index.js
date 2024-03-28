'use strict';

var GetIntrinsic = require('get-intrinsic');
var callBound = require('call-bind/callBound');

var $BigInt = GetIntrinsic('%BigInt%', true);
var $Function = GetIntrinsic('%Function%');

var $toPrecision = callBound('Number.prototype.toPrecision');
var $split = callBound('String.prototype.split');
var $replace = callBound('String.prototype.replace');

// eslint-disable-next-line no-extra-parens
var MAX_SAFE_INTEGER = /** @type {9007199254740991} */ (Number.MAX_SAFE_INTEGER) || 9007199254740991; // Math.pow(2, 53) - 1;

// node v10.4-v10.8 have a bug where you can't `BigInt(x)` anything larger than MAX_SAFE_INTEGER
var needsBigIntHack = false;
if ($BigInt) {
	try {
		$BigInt(Math.pow(2, 64));
	} catch (e) {
		needsBigIntHack = true;
	}
}

/** @type {import('.')} */
module.exports = needsBigIntHack ? function safeBigInt(int) {
	if (typeof int === 'bigint') {
		return int;
	}
	if (int > MAX_SAFE_INTEGER || -int > MAX_SAFE_INTEGER) {
		// construct a maximum-precision string of digits
		// from a native serialization like <digits>.<zeroes> or <digit>.<digits>e+<exponent>
		var preciseParts = $split($toPrecision(+int, 100), 'e');
		var significand = $replace(preciseParts[0], /(\.[0-9]*?)0*$/, '$1');
		var baseTenExponent = +(preciseParts[1] || 0);
		if (baseTenExponent > 0) {
			var significandScale = (significand + '.').indexOf('.');
			baseTenExponent -= significand.length - 1 - significandScale;
		}
		var digits = $replace(significand, '.', '') + Array(baseTenExponent + 1).join('0');
		return $Function('return ' + digits + 'n')();
	}
	// @ts-expect-error TS can't figure out that needsBigIntHack implies $BigInt
	return $BigInt(int);
} : $BigInt;
