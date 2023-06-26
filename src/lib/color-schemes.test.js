import { generateThemeVariables, renderColorSchemes } from './color-schemes.js'

const themes = {
	light: {
		base: 'rgb(250, 250, 250)',
		text: 'rgb(5, 10, 60)',
		strong: 'rgb(30, 85, 175)',
	},
	dark: {
		base: 'rgb(5, 10, 35)',
		text: 'rgb(231, 245, 255)',
		strong: 'rgb(222, 184, 135)',
	},
}

describe('generateThemeVariables', () => {
	test('correctly generates theme variables', () => {
		const exp = {
			base: 'var(--theme-base)',
			text: 'var(--theme-text)',
			strong: 'var(--theme-strong)',
		}

		const act = generateThemeVariables(themes)
		expect(act).toEqual(exp)
	})
})

describe('renderColorSchemes', () => {
	test('correctly renders color scheme media queries', () => {
		const exp = `@media (prefers-color-scheme: light) {
	:global(:root) {
		--theme-base: rgb(250, 250, 250);
		--theme-text: rgb(5, 10, 60);
		--theme-strong: rgb(30, 85, 175);
	}
}

@media (prefers-color-scheme: dark) {
	:global(:root) {
		--theme-base: rgb(5, 10, 35);
		--theme-text: rgb(231, 245, 255);
		--theme-strong: rgb(222, 184, 135);
	}
}

` // Two lines are always appended for a little space

		const act = renderColorSchemes(themes)
		expect(act).toEqual(exp)
	})
})
