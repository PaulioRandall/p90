import { p90 } from './svelte.js'

describe('svelte/p90', () => {
	test('Integration', () => {
		const styles = {
			color: 'blue',
		}

		const sveltePreProcessor = p90(styles)

		const given = {
			content: '$color',
			attributes: { lang: 'text/p90' },
			filename: 'Test.svelte',
		}

		const exp = {
			code: 'blue',
		}

		const promise = sveltePreProcessor.style(given)
		expect(promise).resolves.toEqual(exp)
	})
})
