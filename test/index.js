'use strict';

var test = require('tape');
var safeBigInt = require('../');
var modernEntrypoint = require('../modern');
var forEach = require('for-each');
var inspect = require('object-inspect');

var isSafe = require('../is-safe');
var needsBigIntHack = require('../needs-hack');

test('safeBigInt', function (t) {
	t.equal(
		modernEntrypoint,
		typeof BigInt === 'undefined' ? undefined : BigInt,
		'modernEntrypoint is ' + (typeof BigInt === 'undefined' ? 'undefined' : 'BigInt')
	);

	t.test('no bigints', { skip: typeof BigInt !== 'undefined' }, function (st) {
		st.equal(safeBigInt, undefined, 'safeBigInt is undefined');

		st.end();
	});

	t.test('bigints', { skip: typeof BigInt === 'undefined' }, function (st) {
		forEach([
			'1',
			'-23',
			'9007199254740991',
			'9007199254740992',
			BigInt('9214364837600034814')
		], function (numStr) {
			var num = typeof numStr === 'string' ? +numStr : numStr;

			if (typeof numStr === 'string') {
				st.equal(String(num), numStr, 'String(' + inspect(num) + ') === ' + inspect(numStr));
			}
			// @ts-expect-error TS can't narrow based on tape's `skip`
			var bigint = safeBigInt(num);

			st.equal(typeof bigint, 'bigint', inspect(bigint) + ' is a bigint');

			st.equal(
				// @ts-expect-error TS can't narrow based on tape's `skip`
				inspect(safeBigInt(num)),
				numStr + 'n',
				'safeBigInt(' + inspect(num) + ') === ' + numStr + 'n'
			);
		});

		st.test('envs that may need the workaround', { skip: safeBigInt === BigInt }, function (s2t) {
			s2t.equal(needsBigIntHack, true);

			s2t['throws'](
				function () { BigInt(9007199254740992); },
				RangeError,
				'BigInt(9007199254740992) throws a RangeError'
			);

			s2t.end();
		});

		st.end();
	});

	t.end();
});

test('isSafe', function (t) {
	forEach([
		9007199254740991, // Number.MAX_SAFE_INTEGER
		8.988465674311578e+307,
		72057594037927940
	], function (unsafe) {
		var result = isSafe(unsafe);
		t.equal(typeof result, 'boolean', inspect(result) + ' is a boolean');

		if (safeBigInt) {
			if (result) {
				t.looseEqual(unsafe, BigInt(unsafe), inspect(unsafe) + ' can be safely made into a BigInt with the constructor');
			} else {
				t['throws'](
					function () { BigInt(unsafe); },
					RangeError,
					inspect(unsafe) + ' throws when passed into the constructor'
				);
			}

			var big = safeBigInt(unsafe);
			t.equal(typeof big, 'bigint', inspect(big) + ' is a bigint');
			t.equal(unsafe, Number(big), inspect(unsafe) + ' can be safely made into a BigInt with the package');
		}
	});

	t.end();
});
