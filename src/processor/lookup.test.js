import { lookupProp } from './lookup.js'

describe('lookupProp(...)', () => {
	test('#1', () => {
		const maps = [
			{
				x: 'prop',
			},
		]

		const given = {
			path: ['x'],
		}

		const exp = {
			path: ['x'],
			type: 'string',
			prop: 'prop',
		}

		const act = lookupProp(maps, given)
		expect(act).toEqual(exp)
	})

	test('#2', () => {
		const func = () => 'meh'

		const maps = [
			{
				my: {
					func,
				},
			},
		]

		const given = {
			path: ['my', 'func'],
		}

		const exp = {
			path: ['my', 'func'],
			type: 'function',
			prop: func,
		}

		const act = lookupProp(maps, given)
		expect(act).toEqual(exp)
	})

	test('#3', () => {
		const maps = [
			{
				list: [1, 2, 3],
			},
		]

		const given = {
			path: ['list'],
		}

		const exp = {
			path: ['list'],
			type: 'array',
			prop: [1, 2, 3],
		}

		const act = lookupProp(maps, given)
		expect(act).toEqual(exp)
	})

	test('#4', () => {
		const maps = [{ a: 'alpha' }, { b: 'beta' }, { c: 'charlie' }]

		const given = {
			path: ['c'],
		}

		const exp = {
			path: ['c'],
			type: 'string',
			prop: 'charlie',
		}

		const act = lookupProp(maps, given)
		expect(act).toEqual(exp)
	})
})
