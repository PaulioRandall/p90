import { applyStyles } from './apply-styles.js'

const newFile = (content, markup, attributes, filename) => {
	return {
		content: content,
		markup: markup ? markup : '',
		attributes: attributes ? attributes : [],
		filename: filename ? filename : '',
	}
}

const applyStylesToFile = (styles, file) => {
	return applyStyles(styles).style(file).code
}

const applyStylesToCss = (styles, css) => {
	const file = newFile(css)
	return applyStyles(styles).style(file).code
}

describe('applyStyles substitutes when', () => {
	test('the placeholder is the only CSS', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(styles, `$green`)
		expect(act).toEqual('forestgreen')
	})

	test('normal CSS appears before and after the placeholder value', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(styles, `color: $green; font-size: 200%;`)
		expect(act).toEqual(`color: forestgreen; font-size: 200%;`)
	})

	test('the same placeholder is used multiple times', () => {
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

	test('substitutes when the different placeholders are used', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = applyStylesToCss(styles, `color: $green; color: $red;`)
		expect(act).toEqual(`color: forestgreen; color: indianred;`)
	})

	test('new lines appear in the CSS', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = applyStylesToCss(styles, `color: $green;\ncolor: $red;`)
		expect(act).toEqual(`color: forestgreen;\ncolor: indianred;`)
	})

	test('the replacement value is an array', () => {
		const styles = {
			blood_red: [115, 16, 16],
		}

		const act = applyStylesToCss(styles, `color: rgb($blood_red);`)
		expect(act).toEqual(`color: rgb(115, 16, 16);`)
	})

	test('the styles are nested', () => {
		const styles = {
			color: {
				blood_red: 'rgb(115, 16, 16)',
			},
		}

		const act = applyStylesToCss(styles, `color: $color.blood_red;`)
		expect(act).toEqual(`color: rgb(115, 16, 16);`)
	})

	test('styles contain multiple levels of nesting', () => {
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
})

describe('applyStyles is given multiple style sets', () => {
	test('they are all executed in order', () => {
		const styles = [
			{ first: '$second' },
			{ second: '$third' },
			{ third: '\\o/' },
		]

		const act = applyStylesToCss(styles, `$first`)
		expect(act).toEqual('\\o/')
	})
})

describe('applyStyles fails when', () => {
	test('a style value is null or undefined', () => {
		const styles = {
			green: null,
		}

		const f = () => applyStylesToCss(styles, `$green`)
		expect(f).toThrow(TypeError)
	})
})
