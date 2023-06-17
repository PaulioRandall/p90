export const applyStyles = (styles) => {
	return {
		style: ({ content, markup, attributes, filename }) => {
			const isPureCSS = attributes.lang && attributes.lang
			if (isPureCSS) {
				return { code: content }
			}

			let css = content
			css = replaceNamesWithValues(css, '', styles)
			return { code: css }
		},
	}
}

const replaceNamesWithValues = (css, mapPath, map) => {
	for (const fieldName in map) {
		const fullName = joinNames(mapPath, fieldName)
		css = replaceNameWithValue(css, fullName, map[fieldName])
	}
	return css
}

const replaceNameWithValue = (css, name, value) => {
	if (value === null || value === undefined) {
		throw new Error(`Null or undefined value '${name}'`)
	}

	if (isObject(value)) {
		return replaceNamesWithValues(css, name, value)
	}

	value = stringifyValue(name, value)
	return injectValue(css, name, value)
}

const injectValue = (css, fullName, value) => {
	const lookAheadForEndOfName = '(?=[^a-z0-9-_])'
	const s = escapeForRegex(fullName)
	const p = new RegExp(`\\\$${s}${lookAheadForEndOfName}`, 'g')
	return css.replace(p, value)
}

const joinNames = (...names) => {
	return names
		.map((n) => n.trim())
		.filter((n) => n.length > 0)
		.join('.')
}

const isObject = (v) => {
	return typeof v === 'object' && !Array.isArray(v)
}

const stringifyValue = (name, v) => {
	if (Array.isArray(v)) {
		return v.join(', ')
	}

	return v
}

const escapeForRegex = (s) => {
	return s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
}
