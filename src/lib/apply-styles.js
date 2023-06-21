export const applyStyles = (styles) => {
	return {
		style: ({ content, markup, attributes, filename }) => {
			let css = content

			if (!Array.isArray(styles)) {
				styles = [styles]
			}

			css = applyStyleSets(css, styles)
			return { code: css }
		},
	}
}

const applyStyleSets = (css, styles) => {
	for (const set of styles) {
		css = replaceNamesWithValues(css, '', set)
	}
	return css
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
		throw new TypeError(`Null or undefined value '${name}'`)
	}

	if (isObject(value)) {
		return replaceNamesWithValues(css, name, value)
	}

	value = stringifyValue(name, value)
	return injectValue(css, name, value)
}

const injectValue = (css, fullName, value) => {
	const lookAheadForEndOfName = '(?=([^a-z0-9-_]|$))'
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
	return s.replace(/[/\-\.\(\)]/g, '\\$&')
}

// 1. Scan next token
//   1. Look for $ (store start index)
//   2. Scan until hit whitespace or ; (store end index)
//   3. Move scanner to own file and write tests
// NEXT:
// 2. Parse token
//   1. Split into path segments
// 3. Lookup value in config
//   1. If not there throw error
// 4. Replace value in CSS using start & end index

export const applyStyles2 = (styleSets) => {
	return {
		style: ({ content, markup, attributes, filename }) => {
			let css = content

			if (!Array.isArray(styleSets)) {
				styleSets = [styleSets]
			}

			for (const styles of styleSets) {
				let f = newScanner(css)
				let lookupPath = null

				while (f != null) {
					;[lookupPath, f] = f()
					if (lookupPath != null) {
						console.log(lookupPath)
					}
				}
			}

			return { code: css }
		},
	}
}
