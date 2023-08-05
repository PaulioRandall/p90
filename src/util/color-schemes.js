export const themeVariables = (themes) => {
	const result = {}

	for (const name in themes) {
		for (const key in themes[name]) {
			result[key] = `var(--theme-${key})`
		}
	}

	return result
}

export const colorSchemes = (themes) => {
	const toVar = (name, value) => `--theme-${name}: ${value}`
	return colorSchemeMediaQueries(themes, toVar)
}

const colorSchemeMediaQueries = (
	themes,
	toValue = (name, value) => `${name}: ${value}`
) => {
	let result = ''

	for (const name in themes) {
		result += colorSchemeMediaQuery(name, themes[name], toValue)
		result += '\n\n'
	}

	return result
}

const colorSchemeMediaQuery = (name, theme, toValue) => {
	let result = `@media (prefers-color-scheme: ${name}) {`
	result += '\n\t:global(:root) {'

	for (const key in theme) {
		const value = toValue(key, theme[key])
		result += `\n\t\t${value};`
	}

	result += '\n\t}'
	result += '\n}'
	return result
}
