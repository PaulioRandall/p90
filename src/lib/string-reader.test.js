import stringReader from './string-reader.js'

const testFunc = ({ func, given, regex, exp, expError, expEmtpy = true }) => {
	const sr = stringReader.new(given)
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

describe('WHEN acceptRune is called', () => {
	describe('WITH matching regex', () => {
		testFunc({
			func: 'acceptRune',
			given: 'a',
			regex: /a/,
			exp: 'a',
		})
	})

	describe('WITH non-matching regex', () => {
		testFunc({
			func: 'acceptRune',
			given: 'a',
			regex: /b/,
			exp: null,
			expEmtpy: false,
		})
	})

	describe('WITH empty reader', () => {
		testFunc({
			func: 'acceptRune',
			given: '',
			regex: /a/,
			exp: null,
		})
	})
})

describe('WHEN expectRune is called', () => {
	describe('WITH matching regex', () => {
		testFunc({
			func: 'expectRune',
			given: 'a',
			regex: /a/,
			exp: 'a',
		})
	})

	describe('WITH non-matching regex', () => {
		testFunc({
			func: 'expectRune',
			given: 'a',
			regex: /b/,
			expError: Error,
		})
	})
})
