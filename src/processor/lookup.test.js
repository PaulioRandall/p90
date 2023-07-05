import { lookupProp } from './lookup.js'

describe('lookupProp(...)', () => {
	test('#1', () => {
		const map = {
			x: 'prop',
		}

		const given = {
			path: ['x'],
		}

		const exp = {
			path: ['x'],
			type: 'string',
			prop: 'prop',
		}

		const act = lookupProp(map, given)
		expect(act).toEqual(exp)
	})

	test('#2', () => {
		const func = () => 'meh'

		const map = {
			my: {
				func,
			},
		}

		const given = {
			path: ['my', 'func'],
		}

		const exp = {
			path: ['my', 'func'],
			type: 'function',
			prop: func,
		}

		const act = lookupProp(map, given)
		expect(act).toEqual(exp)
	})

	test('#3', () => {
		const map = {
			list: [1, 2, 3],
		}

		const given = {
			path: ['list'],
		}

		const exp = {
			path: ['list'],
			type: 'array',
			prop: [1, 2, 3],
		}

		const act = lookupProp(map, given)
		expect(act).toEqual(exp)
	})
})
