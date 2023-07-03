import { processCss } from './processor.js'

const joinLines = (...lines) => lines.join('\n')

const doProcessCss = async (styles, css, config = {}) => {
	return await processCss(css, styles, {
		filename: 'Test.svelte',
		...config,
	})
}

describe('processCss({...})', () => {
	test('#1', () => {
		const styles = {
			green: 'forestgreen',
		}

		const promise = doProcessCss(styles, `$green`)
		expect(promise).resolves.toEqual('forestgreen')
	})

	test('#2', () => {
		const styles = {
			green: 'forestgreen',
		}

		const promise = doProcessCss(styles, `color: $green; font-size: 200%;`)
		expect(promise).resolves.toEqual(`color: forestgreen; font-size: 200%;`)
	})

	test('#3', () => {
		const styles = {
			green: 'forestgreen',
		}

		const promise = doProcessCss(
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

		const promise = doProcessCss(
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

		const promise = doProcessCss(styles, 'color: rgb($blood_red);')
		expect(promise).resolves.toEqual('color: rgb(115,16,16);')
	})

	test('#6', () => {
		const styles = {
			color: {
				blood_red: 'rgb(115, 16, 16)',
			},
		}

		const act = doProcessCss(styles, `color: $color.blood_red;`)
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

		const act = doProcessCss(styles, `color: $useless.nesting.color.blood_red;`)

		expect(act).resolves.toEqual(`color: rgb(115, 16, 16);`)
	})

	test('#8', () => {
		const styles = {
			green: '',
			red: 0,
		}

		const promise = doProcessCss(
			styles,
			joinLines('color: $green;', 'color: $red;')
		)

		expect(promise).resolves.toEqual(joinLines('color: ;', 'color: 0;'))
	})

	test('#9', () => {
		const styles = {
			green: undefined,
		}

		const promise = doProcessCss(styles, `$green`)
		expect(promise).resolves.toEqual('$green')
	})

	test('#10', () => {
		const styles = {
			color: () => {
				return 'scarlet'
			},
		}

		const promise = doProcessCss(styles, `$color`)
		expect(promise).resolves.toEqual('scarlet')
	})

	test('#11', () => {
		const styles = {
			color: () => {
				return undefined
			},
		}

		const config = {
			failOnError: true,
			printErrors: false,
		}

		const promise = doProcessCss(styles, `$color`, config)
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

		const promise = doProcessCss(styles, `$func(alpha, beta, charlie)`)
		expect(promise).resolves.toEqual('alpha-beta-charlie')
		expect(unspecifiedArg).toBeUndefined()
	})

	test('#13', () => {
		const styles = {
			color: async () => {
				return 'scarlet'
			},
		}

		const promise = doProcessCss(styles, `$color`)
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
			'  $highlightable',
			'}',
			'',
			'.menu-item:hover {',
			'  $highlighted',
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

		const promise = doProcessCss(styles, css)
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
			'  $highlight', // <-- Simulated user error
			'}',
			'',
			'.menu-item:hover {',
			'  $highlight.hover',
			'}'
		)

		const config = {
			failOnError: true,
			printErrors: false,
		}

		const promise = doProcessCss(styles, css, config)
		expect(promise).rejects.toBeInstanceOf(Error)
	})

	test('#16', () => {
		const styles = {
			empty: null,
		}

		const promise = doProcessCss(styles, `$empty`)
		expect(promise).resolves.toEqual('')
	})

	test('#17', () => {
		const styles = {
			$: '$',
		}

		const promise = doProcessCss(styles, `$$`)
		expect(promise).resolves.toEqual('$')
	})

	test('#18', () => {
		const styles = {
			$$$: '$',
		}

		const promise = doProcessCss(styles, `$$$$`)
		expect(promise).resolves.toEqual('$')
	})

	test('#19', () => {
		const styles = {
			$: (n = 1) => '$'.repeat(n),
		}

		const promise = doProcessCss(styles, `$$(4)`)
		expect(promise).resolves.toEqual('$$$$')
	})

	test('#20', () => {
		const styles = {
			$: (n = 1) => '$'.repeat(n),
		}

		const promise = doProcessCss(styles, `$$`)
		expect(promise).resolves.toEqual('$')
	})

	test('#21', () => {
		const styles = {
			color: 'forestgreen',
		}

		const css = joinLines('color: $color;', "content: '🫀';", 'color: $color;')
		const promise = doProcessCss(styles, css)

		const exp = joinLines(
			'color: forestgreen;',
			"content: '🫀';",
			'color: forestgreen;'
		)
		expect(promise).resolves.toEqual(exp)
	})
})

describe('skipSpaces([...])', () => {
	test('#1', () => {
		const styles = [
			{ first: '$second' },
			{ second: '$third' },
			{ third: '\\o/' },
		]

		const promise = doProcessCss(styles, `$first`)
		expect(promise).resolves.toEqual('\\o/')
	})
})
