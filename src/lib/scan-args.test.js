import { scanArgs, countArgsLen } from './scan-args.js'

const funcNameToken = {
	start: 0,
	end: 1,
	raw: '$func',
	path: ['func'],
	args: [],
}

describe('WHEN countArgsLen called', () => {
	describe("GIVEN function parens with no arguments '()'", () => {
		test('THEN returns empty argument array', () => {
			const given = '()'
			const act = countArgsLen(given, funcNameToken)
			expect(act).toEqual(2)
		})
	})
})
