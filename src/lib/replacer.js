import { newScanFunc } from './scanner.js'

export const sveltePreProcess = (styleSets) => {
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
	const tokens = findAllTokens(css, styles)

	// Work from back to front of the CSS string otherwise replacements at
	// the start will cause later tokens to hold the wrong start & end.
	tokens.reverse()

	for (const tk of tokens) {
		const value = lookupStylesValue(styles, tk)
		css = replaceTokenWithValue(css, tk, value)
	}

	return css
}

const findAllTokens = (css) => {
	const f = newScanFunc(css)
	const result = []
	let token = null

	while ((token = f()) !== null) {
		result.push(token)
	}

	return result
}

const lookupStylesValue = (styles, token) => {
	let value = styles

	for (const part of token.path) {
		value = value[part]
		if (value === undefined || value === null) {
			throw new Error(`Could not find '${part}' in styles['${token.raw}']`)
		}
	}

	return value
}

const replaceTokenWithValue = (css, token, value) => {
	const prefix = css.slice(0, token.start)
	const postfix = css.slice(token.end, css.length)
	return `${prefix}${value}${postfix}`
}
