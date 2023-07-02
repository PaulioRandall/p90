import { resolveValue } from './resolve.js'

describe('resolve(...)', () => {
	test('#1', () => {
		const given = {
			suffix: ';',
			type: 'string',
			prop: 123,
		}

		const exp = {
			suffix: ';',
			type: 'string',
			prop: 123,
			value: '123;',
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#2', () => {
		const given = {
			suffix: ';',
			type: 'null',
			prop: null,
		}

		const exp = {
			suffix: ';',
			type: 'null',
			prop: null,
			value: '',
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#3', () => {
		const given = {
			suffix: ';',
			type: 'undefined',
			prop: undefined,
		}

		const promise = resolveValue(given)
		expect(promise).rejects.toBeInstanceOf(Error)
	})

	test('#4', () => {
		// NOT ASYNC

		const func = (...propNameParts) => propNameParts.join('-')

		const given = {
			suffix: ':',
			args: ['background', 'color'],
			type: 'function',
			prop: func,
		}

		const exp = {
			suffix: ':',
			args: ['background', 'color'],
			type: 'function',
			prop: func,
			value: 'background-color:',
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#5', () => {
		// ASYNC

		const func = async (...propNameParts) => propNameParts.join('-')

		const given = {
			suffix: ':',
			args: ['background', 'color'],
			type: 'function',
			prop: func,
		}

		const exp = {
			suffix: ':',
			args: ['background', 'color'],
			type: 'function',
			prop: func,
			value: 'background-color:',
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#5', () => {
		// WITH SUFFIX

		const given = {
			suffix: ';',
			type: 'object',
			prop: {
				color: 'red',
				'font-size': '2rem',
			},
		}

		const exp = {
			suffix: ';',
			type: 'object',
			prop: {
				color: 'red',
				'font-size': '2rem',
			},
			value: 'color: red;\nfont-size: 2rem;',
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#6', () => {
		// NO SUFFIX

		const given = {
			suffix: '',
			type: 'object',
			prop: {
				color: 'red',
				'font-size': '2rem',
			},
		}

		const exp = {
			suffix: '',
			type: 'object',
			prop: {
				color: 'red',
				'font-size': '2rem',
			},
			value: 'color: red;\nfont-size: 2rem;\n',
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#7', () => {
		const func = () => {
			return {
				color: 'red',
				'font-size': '2rem',
			}
		}

		const given = {
			suffix: ';',
			args: [],
			type: 'function',
			prop: func,
		}

		const exp = {
			suffix: ';',
			args: [],
			type: 'object',
			prop: {
				color: 'red',
				'font-size': '2rem',
			},
			value: 'color: red;\nfont-size: 2rem;',
			recursed: true,
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#8', () => {
		const func = () => {
			return null
		}

		const given = {
			suffix: ';',
			args: [],
			type: 'function',
			prop: func,
		}

		const exp = {
			suffix: ';',
			args: [],
			type: 'null',
			prop: null,
			value: '',
			recursed: true,
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#9', () => {
		const func = () => {
			return undefined
		}

		const given = {
			suffix: ';',
			args: [],
			type: 'function',
			prop: func,
		}

		const promise = resolveValue(given)
		expect(promise).rejects.toBeInstanceOf(Error)
	})

	test('#10', () => {
		const func = () => {
			return () => 'Not allowed to return functions'
		}

		const given = {
			suffix: ';',
			args: [],
			type: 'function',
			prop: func,
		}

		const promise = resolveValue(given)
		expect(promise).rejects.toBeInstanceOf(Error)
	})
})
