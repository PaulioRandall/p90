export const generateThemeVariables = (themes) => {
	const result = {}

	for (const name in themes) {
		for (const key in themes[name]) {
			result[key] = `var(--theme-${key})`
		}
	}

	return result
}

export const renderColorSchemes = (themes) => {
	return generateMediaQueries(themes)
}

const generateMediaQueries = (themes) => {
	let result = ''

	for (const name in themes) {
		result += generateMediaQuery(name, themes[name])
		result += '\n\n'
	}

	return result
}

const generateMediaQuery = (name, theme) => {
	let result = `@media (prefers-color-scheme: ${name}) {`
	result += '\n\t:global(:root) {'

	for (const key in theme) {
		result += `\n\t\t--theme-${key}: ${theme[key]};`
	}

	result += '\n\t}'
	result += '\n}'
	return result
}
