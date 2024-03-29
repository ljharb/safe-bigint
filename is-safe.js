'use strict';

var needsBigIntHack = require('./needs-hack');

// eslint-disable-next-line no-extra-parens
var MAX_SAFE_INTEGER = /** @type {9007199254740991} */ (Number.MAX_SAFE_INTEGER) || 9007199254740991; // Math.pow(2, 53) - 1;

/** @type {import('./is-safe')} */
module.exports = function isSafe(value) {
	if (!needsBigIntHack) {
		return true;
	}

	// eslint-disable-next-line no-extra-parens
	var num = +(/** @type {string} */ (value));

	if (num > MAX_SAFE_INTEGER || -num > MAX_SAFE_INTEGER) {
		return false;
	}
	return true;
};
