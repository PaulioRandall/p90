import { newScanFunc } from './scanner.js'

const newToken = (start, end, raw, path) => {
	return { start, end, raw, path }
}

describe('WHEN newScanFunc called', () => {
	describe('GIVEN emtpy string', () => {
		test('THEN returns null', () => {
			const f = newScanFunc('')
			expect(f).toEqual(null)
		})
	})

	describe('GIVEN non-empty string', () => {
		describe('AND no P90 variables', () => {
			const f = newScanFunc('abc')

			test('THEN returns function', () => {
				expect(typeof f).toBe('function')
			})

			test('THEN returns null', () => {
				expect(f()).toEqual(null)
			})
		})

		describe('AND one P90 variable', () => {
			const f = newScanFunc('$abc')

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
			const f = newScanFunc('$abc$efg$hij')

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
			const f = newScanFunc(given)

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
				const f = newScanFunc('color: $color.green;')
				const exp = newToken(7, 19, '$color.green', ['color', 'green'])
				expect(f()).toEqual(exp)
			})

			test('multiple namespaces THEN returns full path', () => {
				const f = newScanFunc('color: $theme.light.color.base;')
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
})
