import { p90 } from './svelte.js'

describe('svelte/p90', () => {
	test('Integration', () => {
		const valueMap = {
			color: 'blue',
		}

		const sveltePreProcessor = p90(valueMap)

		const given = {
			content: '$color',
			attributes: { lang: 'p90' },
			filename: 'Test.svelte',
		}

		const exp = {
			code: 'blue',
		}

		const promise = sveltePreProcessor.style(given)
		expect(promise).resolves.toEqual(exp)
	})
})
