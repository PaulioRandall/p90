import { newScanFunc } from './scanner.js'

const newToken = (start, end, raw, path) => {
	return { start, end, raw, path }
}

describe('newScanFunc given emtpy string', () => {
	test('returns null', () => {
		const f = newScanFunc('')
		expect(f).toEqual(null)
	})
})

describe('newScanFunc given non-empty string', () => {
	describe('with no P90 variables', () => {
		const f = newScanFunc('abc')

		test('returns function', () => {
			expect(typeof f).toBe('function')
		})

		test('returns null when called', () => {
			expect(f()).toEqual(null)
		})
	})

	describe('with one P90 variable', () => {
		const f = newScanFunc('$abc')

		test('returns function', () => {
			expect(typeof f).toBe('function')
		})

		test('returns first variable when called', () => {
			const exp = newToken(0, 4, '$abc', ['abc'])
			expect(f()).toEqual(exp)
		})

		test('returns null when called twice', () => {
			expect(f()).toEqual(null)
		})
	})

	describe('with several P90 variables without whitespace', () => {
		const f = newScanFunc('$abc$efg$hij')

		test('returns first variable when called', () => {
			const exp = newToken(0, 4, '$abc', ['abc'])
			expect(f()).toEqual(exp)
		})

		test('returns second variable when called twice', () => {
			const exp = newToken(4, 8, '$efg', ['efg'])
			expect(f()).toEqual(exp)
		})

		test('returns thrid variable when called three times', () => {
			const exp = newToken(8, 12, '$hij', ['hij'])
			expect(f()).toEqual(exp)
		})

		test('returns null when called four times', () => {
			expect(f()).toEqual(null)
		})
	})

	describe('with several P90 variables between other chars', () => {
		const given = 'color: $green; font-size: $lg; font-family: $nunito'
		const f = newScanFunc(given)

		test('returns first variable when called', () => {
			const exp = newToken(7, 13, '$green', ['green'])
			expect(f()).toEqual(exp)
		})

		test('returns second variable when called twice', () => {
			const exp = newToken(26, 29, '$lg', ['lg'])
			expect(f()).toEqual(exp)
		})

		test('returns thrid variable when called three times', () => {
			const exp = newToken(44, 51, '$nunito', ['nunito'])
			expect(f()).toEqual(exp)
		})

		test('returns null when called four times', () => {
			expect(f()).toEqual(null)
		})
	})

	describe('with P90 variables that has', () => {
		test('one namespace returns full path', () => {
			const f = newScanFunc('color: $color.green;')
			const exp = newToken(7, 19, '$color.green', ['color', 'green'])
			expect(f()).toEqual(exp)
		})

		test('multiple namespaces returns full path', () => {
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
