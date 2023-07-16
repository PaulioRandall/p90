import { processCss } from './processor.js'

const joinLines = (...lines) => lines.join('\n')

const doProcessCss = async (valueMap, css, config = {}) => {
	return await processCss(css, valueMap, {
		filename: 'Test.svelte',
		...config,
	})
}

describe('processCss({...})', () => {
	test('#1', () => {
		const valueMap = {
			green: 'forestgreen',
		}

		const promise = doProcessCss(valueMap, `$green`)
		expect(promise).resolves.toEqual('forestgreen')
	})

	test('#2', () => {
		const valueMap = {
			green: 'forestgreen',
		}

		const promise = doProcessCss(valueMap, `color: $green; font-size: 200%;`)
		expect(promise).resolves.toEqual(`color: forestgreen; font-size: 200%;`)
	})

	test('#3', () => {
		const valueMap = {
			green: 'forestgreen',
		}

		const promise = doProcessCss(
			valueMap,
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
		const valueMap = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const promise = doProcessCss(
			valueMap,
			joinLines('color: $green;', 'color: $red;')
		)

		expect(promise).resolves.toEqual(
			joinLines('color: forestgreen;', 'color: indianred;')
		)
	})

	test('#5', () => {
		const valueMap = {
			blood_red: [115, 16, 16],
		}

		const promise = doProcessCss(valueMap, 'color: rgb($blood_red);')
		expect(promise).resolves.toEqual('color: rgb(115,16,16);')
	})

	test('#6', () => {
		const valueMap = {
			color: {
				blood_red: 'rgb(115, 16, 16)',
			},
		}

		const act = doProcessCss(valueMap, `color: $color.blood_red;`)
		expect(act).resolves.toEqual(`color: rgb(115, 16, 16);`)
	})

	test('#7', () => {
		const valueMap = {
			useless: {
				nesting: {
					color: {
						blood_red: 'rgb(115, 16, 16)',
					},
				},
			},
		}

		const act = doProcessCss(
			valueMap,
			`color: $useless.nesting.color.blood_red;`
		)

		expect(act).resolves.toEqual(`color: rgb(115, 16, 16);`)
	})

	test('#8', () => {
		const valueMap = {
			green: '',
			red: 0,
		}

		const promise = doProcessCss(
			valueMap,
			joinLines('color: $green;', 'color: $red;')
		)

		expect(promise).resolves.toEqual(joinLines('color: ;', 'color: 0;'))
	})

	test('#9', () => {
		const valueMap = {
			green: undefined,
		}

		const promise = doProcessCss(valueMap, `$green`)
		expect(promise).resolves.toEqual('$green')
	})

	test('#10', () => {
		const valueMap = {
			color: () => {
				return 'scarlet'
			},
		}

		const promise = doProcessCss(valueMap, `$color`)
		expect(promise).resolves.toEqual('scarlet')
	})

	test('#11', () => {
		const valueMap = {
			color: () => {
				return undefined
			},
		}

		const config = {
			throwOnError: true,
			printErrors: false,
		}

		const promise = doProcessCss(valueMap, `$color`, config)
		expect(promise).rejects.toBeInstanceOf(Error)
	})

	test('#12', () => {
		let unspecifiedArg = 'something'

		const valueMap = {
			func: (a, b, c, d) => {
				unspecifiedArg = d
				return `${a}-${b}-${c}`
			},
		}

		const promise = doProcessCss(valueMap, `$func(alpha, beta, charlie)`)
		expect(promise).resolves.toEqual('alpha-beta-charlie')
		expect(unspecifiedArg).toBeUndefined()
	})

	test('#13', () => {
		const valueMap = {
			color: async () => {
				return 'scarlet'
			},
		}

		const promise = doProcessCss(valueMap, `$color`)
		expect(promise).resolves.toEqual('scarlet')
	})

	test('#16', () => {
		const valueMap = {
			empty: null,
		}

		const promise = doProcessCss(valueMap, `$empty`)
		expect(promise).resolves.toEqual('')
	})

	test('#17', () => {
		const promise = doProcessCss({}, `$$`)
		expect(promise).resolves.toEqual('$')
	})

	test('#18', () => {
		const promise = doProcessCss({}, `$$;$$;`)
		expect(promise).resolves.toEqual('$;$;')
	})

	test('#19', () => {
		const promise = doProcessCss({}, `$$$$$$$$`)
		expect(promise).resolves.toEqual('$$$$')
	})

	test('#21', () => {
		const valueMap = {
			color: 'forestgreen',
		}

		const css = joinLines('color: $color;', "content: '🫀';", 'color: $color;')
		const promise = doProcessCss(valueMap, css)

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
		const valueMap = [
			{ first: '$second' },
			{ second: '$third' },
			{ third: '\\o/' },
		]

		const promise = doProcessCss(valueMap, `$first`)
		expect(promise).resolves.toEqual('\\o/')
	})
})
