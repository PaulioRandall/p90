import { replacer } from './replacer.js'

const newFile = (content, markup, attributes, filename) => {
	return {
		content: content,
		markup: markup ? markup : '',
		attributes: attributes ? attributes : [],
		filename: filename ? filename : '',
	}
}

const applyStylesToCss = async (styles, css) => {
	const file = newFile(css)
	const result = await replacer(styles).style(file)
	return result.code
}

describe('WHEN replacer called', () => {
	test('GIVEN placeholder is the only CSS', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(styles, `$green`)
		expect(act).resolves.toEqual('forestgreen')
	})

	test('GIVEN  normal CSS appears before and after the placeholder', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(styles, `color: $green; font-size: 200%;`)
		expect(act).resolves.toEqual(`color: forestgreen; font-size: 200%;`)
	})

	test('GIVEN same placeholder is used multiple times', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(
			styles,
			`color: $green; color: $green; color: $green; color: forestgreen;`
		)
		expect(act).resolves.toEqual(
			`color: forestgreen; color: forestgreen; color: forestgreen; color: forestgreen;`
		)
	})

	test('GIVEN different placeholders are used', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = applyStylesToCss(styles, `color: $green; color: $red;`)
		expect(act).resolves.toEqual(`color: forestgreen; color: indianred;`)
	})

	test('GIVEN new lines appear in the CSS', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = applyStylesToCss(styles, `color: $green;\ncolor: $red;`)
		expect(act).resolves.toEqual(`color: forestgreen;\ncolor: indianred;`)
	})

	test('GIVEN replacement value is an array', () => {
		const styles = {
			blood_red: [115, 16, 16],
		}

		const act = applyStylesToCss(styles, `color: rgb($blood_red);`)
		expect(act).resolves.toEqual(`color: rgb(115,16,16);`)
	})

	test('GIVEN styles are nested', () => {
		const styles = {
			color: {
				blood_red: 'rgb(115, 16, 16)',
			},
		}

		const act = applyStylesToCss(styles, `color: $color.blood_red;`)
		expect(act).resolves.toEqual(`color: rgb(115, 16, 16);`)
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
		expect(act).resolves.toEqual(`color: rgb(115, 16, 16);`)
	})

	test('GIVEN styles contain the falsy values: empty string, number zero', () => {
		const styles = {
			green: '',
			red: 0,
		}

		const act = applyStylesToCss(styles, `color: $green; color: $red;`)
		expect(act).resolves.toEqual(`color: ; color: 0;`)
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
			expect(act).resolves.toEqual('\\o/')
		})
	})

	describe('GIVEN null value in styles', () => {
		test('THEN no replacement should take place', () => {
			const styles = {
				green: null,
			}

			const act = applyStylesToCss(styles, `$green`)
			expect(act).resolves.toEqual('$green')
		})
	})

	/*
	describe('GIVEN function as replacement value', () => {
		describe('THEN function is called', () => {
			test('AND result used for substitution', () => {
				const styles = {
					color: () => {
						return 'scarlet'
					},
				}

				const act = applyStylesToCss(styles, `$color`)
				expect(act).resolves.toEqual('scarlet')
			})

			test('AND null or undefined result throws error', () => {
				const styles = {
					color: () => {
						return null
					},
				}

				const act = applyStylesToCss(styles, `$color`)
				expect(act).rejects.toBeInstanceOf(Error)
			})

			test('AND function has arguments', () => {
				let unspecifiedArg = 'something'

				const styles = {
					func: (a, b, c, d) => {
						unspecifiedArg = d
						return `${a}-${b}-${c}`
					},
				}

				const act = applyStylesToCss(styles, `$func(alpha, beta, charlie)`)
				expect(act).resolves.toEqual('alpha-beta-charlie')
				expect(unspecifiedArg).toBeUndefined()
			})
		})
	})

	describe('GIVEN async function as replacement value', () => {
		describe('THEN function is called', () => {
			test('AND result used for substitution', () => {
				const styles = {
					color: async () => {
						return 'scarlet'
					},
				}

				const act = applyStylesToCss(styles, `$color`)
				expect(act).resolves.toEqual('scarlet')
			})
		})
	})

	describe('GIVEN object as replacement value', () => {
		describe('THEN object is converted into CSS properties (string)', () => {
			test('AND result used for substitution', () => {
				const styles = {
					highlightable: {
						'border-radius': '0.4rem',
						border: '2px solid transparent',
						transition: 'border 300ms ease-out',
					},
					highlighted: {
						border: '2px solid goldenrod',
					},
				}

				const css = [
					'.menu-item {',
					'  $highlightable;',
					'}',
					'',
					'.menu-item:hover {',
					'  $highlighted;',
					'}',
				].join('\n')

				const exp = [
					'.menu-item {',
					'  border-radius: 0.4rem;',
					'border: 2px solid transparent;',
					'transition: border 300ms ease-out;',
					'}',
					'',
					'.menu-item:hover {',
					'  border: 2px solid goldenrod;',
					'}',
				].join('\n')

				const act = applyStylesToCss(styles, css)
				expect(act).resolves.toEqual(exp)
			})
		})

		describe('AND object contains nested objects', () => {
			test('THEN error is thrown', () => {
				const styles = {
					highlight: {
						default: {
							border: '2px solid transparent',
							transition: 'border 300ms ease-out',
						},
						hover: {
							border: '2px solid goldenrod',
						},
					},
				}

				const css = [
					'.menu-item {',
					'  $highlight;', // <-- Simulated user error
					'}',
					'',
					'.menu-item:hover {',
					'  $highlight.hover;',
					'}',
				].join('\n')

				const act = applyStylesToCss(styles, css)
				expect(act).rejects.toBeInstanceOf(Error)
			})
		})
	})
	*/
})
