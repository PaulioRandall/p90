import { applyStyles } from './_apply-styles.js'

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

describe('applyStyles performs correct substitution', () => {
	test('where the placeholder is the only CSS', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(styles, `$green`)
		expect(act).toEqual('forestgreen')
	})

	test('where normal CSS appears before and after the placeholder value', () => {
		const styles = {
			green: 'forestgreen',
		}

		const act = applyStylesToCss(styles, `color: $green; font-size: 200%;`)
		expect(act).toEqual(`color: forestgreen; font-size: 200%;`)
	})

	test('where the same placeholder is used multiple times', () => {
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

	test('where the different placeholders are used', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = applyStylesToCss(styles, `color: $green; color: $red;`)
		expect(act).toEqual(`color: forestgreen; color: indianred;`)
	})

	test('where new lines appear in the CSS', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = applyStylesToCss(styles, `color: $green;\ncolor: $red;`)
		expect(act).toEqual(`color: forestgreen;\ncolor: indianred;`)
	})

	test('where the replacement value is an array', () => {
		const styles = {
			blood_red: [115, 16, 16],
		}

		const act = applyStylesToCss(styles, `color: rgb($blood_red);`)
		expect(act).toEqual(`color: rgb(115, 16, 16);`)
	})

	test('where the styles are nested', () => {
		const styles = {
			color: {
				blood_red: 'rgb(115, 16, 16)',
			},
		}

		const act = applyStylesToCss(styles, `color: $color.blood_red;`)
		expect(act).toEqual(`color: rgb(115, 16, 16);`)
	})

	test('where styles contain multiple levels of nesting', () => {
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

// TODO: Write tests for unhappy cases
