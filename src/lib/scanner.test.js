import { newScanFunc } from './scanner.js'

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
			expect(f()).toEqual('$abc')
		})

		test('returns null when called twice', () => {
			expect(f()).toEqual(null)
		})
	})

	describe('with several P90 variables without whitespace', () => {
		const f = newScanFunc('$abc$efg$hij')

		test('returns first variable when called', () => {
			expect(f()).toEqual('$abc')
		})

		test('returns second variable when called twice', () => {
			expect(f()).toEqual('$efg')
		})

		test('returns thrid variable when called three times', () => {
			expect(f()).toEqual('$hij')
		})

		test('returns null when called four times', () => {
			expect(f()).toEqual(null)
		})
	})

	describe('with several P90 variables between other chars', () => {
		const given = 'color: $green; font-size: $lg; font-family: $nunito'
		const f = newScanFunc(given)

		test('returns first variable when called', () => {
			expect(f()).toEqual('$green')
		})

		test('returns second variable when called twice', () => {
			expect(f()).toEqual('$lg')
		})

		test('returns thrid variable when called three times', () => {
			expect(f()).toEqual('$nunito')
		})

		test('returns null when called four times', () => {
			expect(f()).toEqual(null)
		})
	})

	describe('with P90 variables that has', () => {
		test('one namespace returns full path', () => {
			const given = 'color: $color.green;'
			const f = newScanFunc(given)
			expect(f()).toEqual('$color.green')
		})

		test('multiple namespaces returns full path', () => {
			const given = 'color: $theme.light.color.base;'
			const f = newScanFunc(given)
			expect(f()).toEqual('$theme.light.color.base')
		})
	})
})
