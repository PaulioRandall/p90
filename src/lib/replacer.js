import { newScanFunc } from './scan-tokens.js'

export const replacer = (styleSets) => {
	return {
		style: async ({ content, markup, attributes, filename }) => {
			let css = content

			if (!Array.isArray(styleSets)) {
				styleSets = [styleSets]
			}

			for (const styles of styleSets) {
				css = await replaceAllTokens(css, styles)
			}

			return Promise.resolve({ code: css })
		},
	}
}

const replaceAllTokens = async (css, styles) => {
	const tokens = findAllTokens(css)

	// Work from back to front of the CSS string otherwise replacements at
	// the start will cause later tokens to hold the wrong start & end.
	tokens.reverse()

	for (const tk of tokens) {
		css = await replaceToken(css, styles, tk)
	}

	return css
}

const findAllTokens = (css) => {
	const f = newScanFunc(css)
	const result = []
	let tk = null

	while ((tk = f()) !== null) {
		result.push(tk)
	}

	return result
}

const replaceToken = async (css, styles, tk) => {
	let value = lookupStylesValue(styles, tk)
	if (value === null) {
		return css
	}

	value = resolveValue(tk, value)
	value = await Promise.resolve(value)
	checkReplacementValue(tk, value)

	return replaceTokenWithValue(css, tk, value)
}

const lookupStylesValue = (styles, tk) => {
	let value = styles

	for (const part of tk.path) {
		value = value[part]

		if (value === undefined || value === null) {
			return null
		}
	}

	return value
}

const checkReplacementValue = (tk, value) => {
	if (value === undefined || value === null) {
		throw new Error(
			`Value returned by function '${tk.raw}' returned null or undefined`
		)
	}
}

const resolveValue = (tk, value) => {
	if (isFunction(value)) {
		return value(...tk.args)
	}

	if (isObject(value)) {
		return objectToCss(tk, value)
	}

	return value.toString()
}

const objectToCss = (tk, obj) => {
	const result = []

	for (const prop in obj) {
		const value = obj[prop]
		checkCssPropValue(tk, prop, value)
		result.push(`${prop}: ${value}`)
	}

	return result.join(';\n')
}

const checkCssPropValue = (tk, prop, value) => {
	if (!isValidCssPropValue(value)) {
		throw new Error(
			`For '${tk.raw}', the CSS value for property '${prop}' does not have a valid type`
		)
	}
}

const isValidCssPropValue = (v) => {
	const validTypes = ['string', 'number', 'bigint', 'boolean']

	return validTypes.includes(typeof v)
}

const replaceTokenWithValue = (css, tk, value) => {
	const prefix = css.slice(0, tk.start)
	const postfix = css.slice(tk.end, css.length)
	return `${prefix}${value}${postfix}`
}

const isFunction = (v) => typeof v === 'function'
const isObject = (v) => typeof v === 'object' && !Array.isArray(v)
