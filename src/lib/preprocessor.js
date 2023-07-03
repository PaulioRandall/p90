import tokenScanner from './token-scanner.js'
import { lookupProp } from './lookup.js'
import { resolveValue } from './resolve.js'

const TTY_RED = '\x1b[31m'
const TTY_YELLOW = '\x1b[33m'
const TTY_RESET = '\x1b[0m'

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

			content = content.normalize('NFC')
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

	for (const lookupMap of styleSets) {
		css = await replaceAllTokens(css, lookupMap, filename, options)
	}

	return css
}

const replaceAllTokens = async (css, lookupMap, filename, options) => {
	const tokens = tokenScanner.scanAll(css, '$')

	// Work from back to front of the CSS string otherwise replacements at
	// the start will cause later tokens to hold the wrong start & end.
	tokens.reverse()

	for (const tk of tokens) {
		try {
			css = await replaceToken(css, lookupMap, tk)
		} catch (e) {
			handleError(e, filename, options, tk)
		}
	}

	return css
}

const replaceToken = async (css, lookupMap, tk) => {
	tk = lookupProp(lookupMap, tk)

	if (tk.prop === undefined) {
		return css // Ignore prop, it could be in a following lookupMap
	}

	tk = await resolveValue(tk)

	const prefix = css.slice(0, tk.start)
	const postfix = css.slice(tk.end, css.length)

	return `${prefix}${tk.value}${postfix}`
}

const handleError = (e, filename, options, tk) => {
	if (options.printErrors) {
		const tkStr = JSON.stringify(tk, null, 2)

		process.stderr.write(`${TTY_RED}\nP90 error: ${filename}${TTY_RESET}`)
		process.stderr.write(`${TTY_RED}\n${e.message}${TTY_RESET}`)
		process.stderr.write(`${TTY_YELLOW}\nP90 token: ${tkStr}${TTY_RESET}\n`)
	}

	if (options.failOnError) {
		throw e
	}
}
