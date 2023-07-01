import tokenScanner from './token-scanner.js'

const newToken = (start, end, raw, path, args = []) => {
	return {
		start,
		end,
		prefix: '$',
		raw,
		suffix: ';',
		path,
		args,
	}
}

describe('scanFunc(...)', () => {
	test('#1', () => {
		const f = tokenScanner.scanFunc('abc')

		expect(typeof f).toBe('function')
		expect(f()).toEqual(null)
	})

	test('#2', () => {
		const f = tokenScanner.scanFunc('$abc;')
		expect(typeof f).toBe('function')

		let exp = newToken(0, 5, '$abc;', ['abc'])
		expect(f()).toEqual(exp)

		expect(f()).toEqual(null)
	})

	test('#3', () => {
		const f = tokenScanner.scanFunc('$abc;$efg;$hij;')

		let exp = newToken(0, 5, '$abc;', ['abc'])
		expect(f()).toEqual(exp)

		exp = newToken(5, 10, '$efg;', ['efg'])
		expect(f()).toEqual(exp)

		exp = newToken(10, 15, '$hij;', ['hij'])
		expect(f()).toEqual(exp)

		expect(f()).toEqual(null)
	})

	test('#4', () => {
		const given = 'color: $green; font-size: $lg; font-family: $nunito;'
		const f = tokenScanner.scanFunc(given)

		let exp = newToken(7, 14, '$green;', ['green'])
		expect(f()).toEqual(exp)

		exp = newToken(26, 30, '$lg;', ['lg'])
		expect(f()).toEqual(exp)

		exp = newToken(44, 52, '$nunito;', ['nunito'])
		expect(f()).toEqual(exp)

		expect(f()).toEqual(null)
	})

	test('#5', () => {
		const f = tokenScanner.scanFunc('color: $color.green;')
		const exp = newToken(7, 20, '$color.green;', ['color', 'green'])
		expect(f()).toEqual(exp)
	})

	test('#6', () => {
		const f = tokenScanner.scanFunc('color: $theme.light.color.base;')
		const exp = newToken(7, 31, '$theme.light.color.base;', [
			'theme',
			'light',
			'color',
			'base',
		])

		expect(f()).toEqual(exp)
	})

	test('#7', () => {
		const f = tokenScanner.scanFunc('$func();')
		const exp = newToken(0, 8, '$func();', ['func'])
		expect(f()).toEqual(exp)
	})

	test('#8', () => {
		const f = tokenScanner.scanFunc('$func(abc);')
		const exp = newToken(0, 11, '$func(abc);', ['func'], ['abc'])
		expect(f()).toEqual(exp)
	})

	test('#9', () => {
		const f = tokenScanner.scanFunc('$func(1,2,3);')
		const exp = newToken(0, 13, '$func(1,2,3);', ['func'], ['1', '2', '3'])
		expect(f()).toEqual(exp)
	})

	test('#10', () => {
		const f = tokenScanner.scanFunc('$func(abc,efg,hij);')
		const exp = newToken(
			0,
			19,
			'$func(abc,efg,hij);',
			['func'],
			['abc', 'efg', 'hij']
		)
		expect(f()).toEqual(exp)
	})

	test('#11', () => {
		const f = tokenScanner.scanFunc('$func(1, 2, 3);')
		const exp = newToken(0, 15, '$func(1, 2, 3);', ['func'], ['1', '2', '3'])
		expect(f()).toEqual(exp)
	})
})
