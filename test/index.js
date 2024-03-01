'use strict';

var test = require('tape');
var safeBigInt = require('../');
var modernEntrypoint = require('../modern');
var forEach = require('for-each');
var inspect = require('object-inspect');

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
			'9007199254740992'
		], function (numStr) {
			var num = +numStr;

			st.equal(String(num), numStr, 'String(' + inspect(num) + ') === ' + inspect(numStr));
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
