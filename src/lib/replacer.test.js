import { replacer } from './replacer.js'

const newFile = (content, markup, attributes, filename) => {
	return {
		content: content,
		markup: markup ? markup : '',
		attributes: attributes ? attributes : [],
		filename: filename ? filename : '',
	}
}

const applyStylesToFile = (styles, file) => {
	return replacer(styles).style(file).code
}

const applyStylesToCss = (styles, css) => {
	const file = newFile(css)
	return replacer(styles).style(file).code
}

describe('WHEN replacer called', () => {
	test('GIVEN placeholder is the only CSS', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(styles, `$green`)
		expect(act).toEqual('forestgreen')
	})

	test('GIVEN  normal CSS appears before and after the placeholder', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(styles, `color: $green; font-size: 200%;`)
		expect(act).toEqual(`color: forestgreen; font-size: 200%;`)
	})

	test('GIVEN same placeholder is used multiple times', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(
			styles,
			`color: $green; color: $green; color: $green; color: forestgreen;`
		)
		expect(act).toEqual(
			`color: forestgreen; color: forestgreen; color: forestgreen; color: forestgreen;`
		)
	})

	test('GIVEN different placeholders are used', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = applyStylesToCss(styles, `color: $green; color: $red;`)
		expect(act).toEqual(`color: forestgreen; color: indianred;`)
	})

	test('GIVEN new lines appear in the CSS', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = applyStylesToCss(styles, `color: $green;\ncolor: $red;`)
		expect(act).toEqual(`color: forestgreen;\ncolor: indianred;`)
	})

	test('GIVEN replacement value is an array', () => {
		const styles = {
			blood_red: [115, 16, 16],
		}

		const act = applyStylesToCss(styles, `color: rgb($blood_red);`)
		expect(act).toEqual(`color: rgb(115,16,16);`)
	})

	test('GIVEN styles are nested', () => {
		const styles = {
			color: {
				blood_red: 'rgb(115, 16, 16)',
			},
		}

		const act = applyStylesToCss(styles, `color: $color.blood_red;`)
		expect(act).toEqual(`color: rgb(115, 16, 16);`)
	})

	test('GIVEN styles contain multiple levels of nesting', () => {
		const styles = {
			useless: {
				nesting: {
					color: {
						blood_red: 'rgb(115, 16, 16)',
					},
				},
			},
		}

		const act = applyStylesToCss(
			styles,
			`color: $useless.nesting.color.blood_red;`
		)
		expect(act).toEqual(`color: rgb(115, 16, 16);`)
	})

	test('GIVEN styles contain the falsy values: empty string, number zero', () => {
		const styles = {
			green: '',
			red: 0,
		}

		const act = applyStylesToCss(styles, `color: $green; color: $red;`)
		expect(act).toEqual(`color: ; color: 0;`)
	})
})

describe('WHEN replacer called', () => {
	describe('GIVEN multiple style sets', () => {
		test('THEN they are all executed in order', () => {
			const styles = [
				{ first: '$second' },
				{ second: '$third' },
				{ third: '\\o/' },
			]

			const act = applyStylesToCss(styles, `$first`)
			expect(act).toEqual('\\o/')
		})
	})

	describe('GIVEN null value in styles', () => {
		test('THEN error should be thrown', () => {
			const styles = {
				green: null,
			}

			const f = () => applyStylesToCss(styles, `$green`)
			expect(f).toThrow(Error)
		})
	})

	describe('GIVEN function as replacement value', () => {
		describe('THEN function is called', () => {
			test('AND result used for substitution', () => {
				const styles = {
					color: () => {
						return 'scarlet'
					},
				}

				const act = applyStylesToCss(styles, `$color`)
				expect(act).toEqual('scarlet')
			})

			test('AND null or undefined result throws error', () => {
				const styles = {
					color: () => {
						return null
					},
				}

				const f = () => applyStylesToCss(styles, `$color`)
				expect(f).toThrow(Error)
			})
		})
	})
})
