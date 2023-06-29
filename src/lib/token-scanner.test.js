import tokenScanner from './token-scanner.js'

const newToken = (start, end, raw, path, args = []) => {
	return { start, end, raw, path, args }
}

describe('WHEN newScanFunc called', () => {
	describe('GIVEN emtpy string', () => {
		test('THEN returns null', () => {
			const f = tokenScanner.scanFunc('')
			expect(f).toEqual(null)
		})
	})

	describe('GIVEN non-empty string', () => {
		describe('AND no P90 variables', () => {
			const f = tokenScanner.scanFunc('abc')

			test('THEN returns function', () => {
				expect(typeof f).toBe('function')
			})

			test('THEN returns null', () => {
				expect(f()).toEqual(null)
			})
		})

		describe('AND one P90 variable', () => {
			const f = tokenScanner.scanFunc('$abc')

			test('THEN returns function', () => {
				expect(typeof f).toBe('function')
			})

			test('THEN returns first variable', () => {
				const exp = newToken(0, 4, '$abc', ['abc'])
				expect(f()).toEqual(exp)
			})

			test('THEN returns null when called twice', () => {
				expect(f()).toEqual(null)
			})
		})

		describe('AND several P90 variables without whitespace', () => {
			const f = tokenScanner.scanFunc('$abc$efg$hij')

			test('THEN returns first variable', () => {
				const exp = newToken(0, 4, '$abc', ['abc'])
				expect(f()).toEqual(exp)
			})

			test('THEN returns second variable', () => {
				const exp = newToken(4, 8, '$efg', ['efg'])
				expect(f()).toEqual(exp)
			})

			test('THEN returns thrid variable', () => {
				const exp = newToken(8, 12, '$hij', ['hij'])
				expect(f()).toEqual(exp)
			})

			test('THEN returns null', () => {
				expect(f()).toEqual(null)
			})
		})

		describe('AND several P90 variables between other chars', () => {
			const given = 'color: $green; font-size: $lg; font-family: $nunito'
			const f = tokenScanner.scanFunc(given)

			test('THEN returns first variable', () => {
				const exp = newToken(7, 13, '$green', ['green'])
				expect(f()).toEqual(exp)
			})

			test('THEN returns second variable', () => {
				const exp = newToken(26, 29, '$lg', ['lg'])
				expect(f()).toEqual(exp)
			})

			test('THEN returns thrid variable', () => {
				const exp = newToken(44, 51, '$nunito', ['nunito'])
				expect(f()).toEqual(exp)
			})

			test('THEN returns null', () => {
				expect(f()).toEqual(null)
			})
		})

		describe('AND P90 variables that has', () => {
			test('one namespace THEN returns full path', () => {
				const f = tokenScanner.scanFunc('color: $color.green;')
				const exp = newToken(7, 19, '$color.green', ['color', 'green'])
				expect(f()).toEqual(exp)
			})

			test('multiple namespaces THEN returns full path', () => {
				const f = tokenScanner.scanFunc('color: $theme.light.color.base;')
				const exp = newToken(7, 30, '$theme.light.color.base', [
					'theme',
					'light',
					'color',
					'base',
				])

				expect(f()).toEqual(exp)
			})
		})
	})

	describe('GIVEN token with parens BUT no arguments', () => {
		test('THEN returns token with no arguments', () => {
			const f = tokenScanner.scanFunc('$func()')
			const exp = newToken(0, 7, '$func()', ['func'])
			expect(f()).toEqual(exp)
		})
	})

	describe('GIVEN token with one argument', () => {
		test('THEN returns token with that argument', () => {
			const f = tokenScanner.scanFunc('$func(abc)')
			const exp = newToken(0, 10, '$func(abc)', ['func'], ['abc'])
			expect(f()).toEqual(exp)
		})
	})

	describe('GIVEN token with multiple arguments', () => {
		test('THEN returns token with those arguments', () => {
			const f = tokenScanner.scanFunc('$func(1,2,3)')
			const exp = newToken(0, 12, '$func(1,2,3)', ['func'], ['1', '2', '3'])
			expect(f()).toEqual(exp)
		})

		test('THEN returns token with those arguments', () => {
			const f = tokenScanner.scanFunc('$func(abc,efg,hij)')
			const exp = newToken(
				0,
				18,
				'$func(abc,efg,hij)',
				['func'],
				['abc', 'efg', 'hij']
			)
			expect(f()).toEqual(exp)
		})

		describe('AND args have whitespace between', () => {
			test('THEN returns token with those arguments', () => {
				const f = tokenScanner.scanFunc('$func(1, 2, 3)')
				const exp = newToken(0, 14, '$func(1, 2, 3)', ['func'], ['1', '2', '3'])
				expect(f()).toEqual(exp)
			})
		})
	})
})
