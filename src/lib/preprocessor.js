import tokenScanner from './token-scanner.js'

const ttyRed = '\x1b[31m'
const ttyYellow = '\x1b[33m'
const ttyReset = '\x1b[0m'

export const defaultMimeTypes = ['', 'text/css', 'text/p90']

export const p90 = (styleSets, options = {}) => {
	options = {
		failOnError: false,
		printErrors: true,
		mimeTypes: defaultMimeTypes,
		...options,
	}

	return {
		style: async ({ content, markup, attributes, filename }) => {
			if (!isP90Style(options.mimeTypes, attributes.lang)) {
				return content
			}

			content = await processCss(content, styleSets, filename, options)

			return Promise.resolve({ code: content })
		},
	}
}

const isP90Style = (mimeTypes, lang) => {
	lang = lang ? lang : ''
	return mimeTypes.includes(lang)
}

const processCss = async (css, styleSets, filename, options) => {
	if (!Array.isArray(styleSets)) {
		styleSets = [styleSets]
	}

	for (const styles of styleSets) {
		css = await replaceAllTokens(css, styles, filename, options)
	}

	return css
}

const replaceAllTokens = async (css, styles, filename, options) => {
	const tokens = tokenScanner.scanAll(css, '$')

	// Work from back to front of the CSS string otherwise replacements at
	// the start will cause later tokens to hold the wrong start & end.
	tokens.reverse()

	for (const tk of tokens) {
		try {
			css = await replaceToken(css, styles, tk)
		} catch (e) {
			if (options.printErrors) {
				process.stderr.write(`${ttyRed}\nP90 error: ${filename}${ttyReset}`)
				process.stderr.write(
					`${ttyYellow}\nP90 token: ${JSON.stringify(tk, null, 2)}${ttyReset}\n`
				)
			}

			if (options.failOnError) {
				throw e
			}
		}
	}

	return css
}

const replaceToken = async (css, styles, tk) => {
	let value = lookupStylesValue(styles, tk)
	if (value === undefined) {
		return css
	}

	value = resolveValue(tk, value)
	value = await Promise.resolve(value)
	checkReplacementValue(tk, value)

	if (value === null) {
		return replaceTokenWithValue(css, tk, '')
	}

	value += tk.suffix
	return replaceTokenWithValue(css, tk, value)
}

const lookupStylesValue = (styles, tk) => {
	let value = styles

	for (const part of tk.path) {
		if (value === undefined || value === null) {
			return undefined
		}

		value = value[part]
	}

	return value
}

const checkReplacementValue = (tk, value) => {
	if (value === undefined) {
		throw new Error(`Value returned by function '${tk.raw}' returned undefined`)
	}
}

const resolveValue = (tk, value) => {
	if (value === null) {
		return null
	}

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

	return result.join(';\n') + ';\n'
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
