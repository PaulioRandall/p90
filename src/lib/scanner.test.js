import { newScanner } from './scanner.js'

const testFunc = ({ func, given, regex, exp, expError, expEmtpy = true }) => {
	const sr = newScanner(given)
	const f = () => sr[func](regex)

	if (expError) {
		expect(f).toThrow(expError)
		return
	}

	const act = f()
	it('THEN returns the result', () => expect(act).toEqual(exp))

	if (expEmtpy) {
		it('AND reader will be empty', () => expect(sr.isEmpty()).toEqual(true))
	} else {
		it('AND reader will NOT be empty', () =>
			expect(sr.isEmpty()).toEqual(false))
	}
}

describe('WHEN accept is called', () => {
	describe('WITH matching regex', () => {
		testFunc({
			func: 'accept',
			given: 'a',
			regex: /a/,
			exp: 'a',
		})
	})

	describe('WITH non-matching regex', () => {
		testFunc({
			func: 'accept',
			given: 'a',
			regex: /b/,
			exp: null,
			expEmtpy: false,
		})
	})

	describe('WITH empty reader', () => {
		testFunc({
			func: 'accept',
			given: '',
			regex: /a/,
			exp: null,
		})
	})
})

describe('WHEN expect is called', () => {
	describe('WITH matching regex', () => {
		testFunc({
			func: 'expect',
			given: 'a',
			regex: /a/,
			exp: 'a',
		})
	})

	describe('WITH non-matching regex', () => {
		testFunc({
			func: 'expect',
			given: 'a',
			regex: /b/,
			expError: Error,
		})
	})
})

describe('scanner.seek', () => {
	test('#1', () => {
		const sr = newScanner('abc')
		const found = sr.seek(/b/)

		expect(found).toEqual(true)
		expect(sr.index()).toEqual(1)
	})

	test('#2', () => {
		const sr = newScanner('abc')
		const found = sr.seek(/d/)

		expect(found).toEqual(false)
		expect(sr.index()).toEqual(3)
	})
})
