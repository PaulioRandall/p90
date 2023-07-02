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

		const exp = {
			suffix: ';',
			type: 'undefined',
			prop: undefined,
			value: undefined,
		}

		const promise = resolveValue(given)
		expect(promise).resolves.toEqual(exp)
	})

	test('#4', async () => {
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

	test('#5', async () => {
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

	test('#5', async () => {
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

	test('#6', async () => {
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
})
