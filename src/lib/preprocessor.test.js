import { preprocessor } from './preprocessor.js'

const newFile = (content, markup, attributes, filename) => {
	return {
		content: content,
		markup: markup ? markup : '',
		attributes: attributes ? attributes : [],
		filename: filename ? filename : '',
	}
}

const applyStylesToCss = async (styles, css, options) => {
	const file = newFile(css)
	const result = await preprocessor(styles, options).style(file)
	return result.code
}

const joinLines = (...lines) => lines.join('\n')

describe('preprocessor(..., { prefixRune="#" })', () => {
	test('#1', () => {
		const styles = {
			green: 'forestgreen',
		}

		const options = {
			prefixRune: '#',
		}

		const act = applyStylesToCss(styles, `#green`, options)
		expect(act).resolves.toEqual('forestgreen')
	})
})

describe('preprocessor({...})', () => {
	test('#1', () => {
		const styles = {
			green: 'forestgreen',
		}

		const promise = applyStylesToCss(styles, `$green`)
		expect(promise).resolves.toEqual('forestgreen')
	})

	test('#2', () => {
		const styles = {
			green: 'forestgreen',
		}

		const promise = applyStylesToCss(styles, `color: $green; font-size: 200%;`)
		expect(promise).resolves.toEqual(`color: forestgreen; font-size: 200%;`)
	})

	test('#3', () => {
		const styles = {
			green: 'forestgreen',
		}

		const promise = applyStylesToCss(
			styles,
			joinLines(
				'color: $green;',
				'color: $green;',
				'color: $green;',
				'color: forestgreen;'
			)
		)

		expect(promise).resolves.toEqual(
			joinLines(
				'color: forestgreen;',
				'color: forestgreen;',
				'color: forestgreen;',
				'color: forestgreen;'
			)
		)
	})

	test('#4', () => {
		const styles = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const promise = applyStylesToCss(
			styles,
			joinLines('color: $green;', 'color: $red;')
		)

		expect(promise).resolves.toEqual(
			joinLines('color: forestgreen;', 'color: indianred;')
		)
	})

	test('#5', () => {
		const styles = {
			blood_red: [115, 16, 16],
		}

		const promise = applyStylesToCss(styles, 'color: rgb($blood_red);')
		expect(promise).resolves.toEqual('color: rgb(115,16,16);')
	})

	test('#6', () => {
		const styles = {
			color: {
				blood_red: 'rgb(115, 16, 16)',
			},
		}

		const act = applyStylesToCss(styles, `color: $color.blood_red;`)
		expect(act).resolves.toEqual(`color: rgb(115, 16, 16);`)
	})

	test('#7', () => {
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

	test('#8', () => {
		const styles = {
			green: '',
			red: 0,
		}

		const promise = applyStylesToCss(
			styles,
			joinLines('color: $green;', 'color: $red;')
		)

		expect(promise).resolves.toEqual(joinLines('color: ;', 'color: 0;'))
	})

	test('#9', () => {
		const styles = {
			green: null,
		}

		const promise = applyStylesToCss(styles, `$green`)
		expect(promise).resolves.toEqual('$green')
	})

	test('#10', () => {
		const styles = {
			color: () => {
				return 'scarlet'
			},
		}

		const promise = applyStylesToCss(styles, `$color`)
		expect(promise).resolves.toEqual('scarlet')
	})

	test('#11', () => {
		const styles = {
			color: () => {
				return null
			},
		}

		const promise = applyStylesToCss(styles, `$color`)
		expect(promise).rejects.toBeInstanceOf(Error)
	})

	test('#12', () => {
		let unspecifiedArg = 'something'

		const styles = {
			func: (a, b, c, d) => {
				unspecifiedArg = d
				return `${a}-${b}-${c}`
			},
		}

		const promise = applyStylesToCss(styles, `$func(alpha, beta, charlie)`)
		expect(promise).resolves.toEqual('alpha-beta-charlie')
		expect(unspecifiedArg).toBeUndefined()
	})

	test('#13', () => {
		const styles = {
			color: async () => {
				return 'scarlet'
			},
		}

		const promise = applyStylesToCss(styles, `$color`)
		expect(promise).resolves.toEqual('scarlet')
	})

	test('#14', () => {
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

		const css = joinLines(
			'.menu-item {',
			'  $highlightable;',
			'}',
			'',
			'.menu-item:hover {',
			'  $highlighted;',
			'}'
		)

		const exp = joinLines(
			'.menu-item {',
			'  border-radius: 0.4rem;',
			'border: 2px solid transparent;',
			'transition: border 300ms ease-out;',
			'}',
			'',
			'.menu-item:hover {',
			'  border: 2px solid goldenrod;',
			'}'
		)

		const promise = applyStylesToCss(styles, css)
		expect(promise).resolves.toEqual(exp)
	})

	test('#15', () => {
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

		const css = joinLines(
			'.menu-item {',
			'  $highlight;', // <-- Simulated user error
			'}',
			'',
			'.menu-item:hover {',
			'  $highlight.hover;',
			'}'
		)

		const promise = applyStylesToCss(styles, css)
		expect(promise).rejects.toBeInstanceOf(Error)
	})
})

describe('preprocessor([...])', () => {
	test('#1', () => {
		const styles = [
			{ first: '$second' },
			{ second: '$third' },
			{ third: '\\o/' },
		]

		const promise = applyStylesToCss(styles, `$first`)
		expect(promise).resolves.toEqual('\\o/')
	})
})
