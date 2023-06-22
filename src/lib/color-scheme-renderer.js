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
	const toVar = (name, value) => `--theme-${name}: ${value}`
	return buildColorSchemeMediaQueries(themes, toVar)
}

const defaultToValue = (name, value) => `${name}: ${value}`
export const buildColorSchemeMediaQueries = (
	themes,
	toValue = defaultToValue
) => {
	let result = ''

	for (const name in themes) {
		result += buildColorSchemeMediaQuery(name, themes[name], toValue)
		result += '\n\n'
	}

	return result
}

const buildColorSchemeMediaQuery = (name, theme, toValue) => {
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
