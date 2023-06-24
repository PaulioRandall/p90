import { newScanFunc } from './scanner.js'

export const replacer = (styleSets) => {
	return {
		style: ({ content, markup, attributes, filename }) => {
			let css = content

			if (!Array.isArray(styleSets)) {
				styleSets = [styleSets]
			}

			for (const styles of styleSets) {
				css = replaceAllTokens(css, styles)
			}

			return { code: css }
		},
	}
}

const replaceAllTokens = (css, styles) => {
	const tokens = findAllTokens(css)

	// Work from back to front of the CSS string otherwise replacements at
	// the start will cause later tokens to hold the wrong start & end.
	tokens.reverse()

	for (const tk of tokens) {
		css = replaceToken(css, styles, tk)
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

const replaceToken = (css, styles, tk) => {
	let value = lookupStylesValue(styles, tk)
	value = resolveValue(value)
	checkValue(tk, value)
	return replaceTokenWithValue(css, tk, value)
}

const lookupStylesValue = (styles, tk) => {
	let value = styles

	for (const part of tk.path) {
		value = value[part]
		if (value === undefined || value === null) {
			throw new Error(`Could not find '${part}' in styles{'${tk.raw}'}`)
		}
	}

	return value
}

const checkValue = (tk, value) => {
	if (value === undefined || value === null) {
		throw new Error(
			`Value returned by function '${tk.raw}' returned null or undefined`
		)
	}
}

const resolveValue = (value) => {
	if (typeof value === 'function') {
		return value()
	}
	return value
}

const replaceTokenWithValue = (css, tk, value) => {
	const prefix = css.slice(0, tk.start)
	const postfix = css.slice(tk.end, css.length)
	return `${prefix}${value}${postfix}`
}