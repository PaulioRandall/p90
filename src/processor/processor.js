import tokenScanner from './token-scanner.js'
import { lookupProp } from './lookup.js'
import { resolveValue } from './resolver.js'

export const processCss = async (css, styles, options) => {
	options = {
		stdout: console.log,
		stderr: console.error,
		throwOnError: false,
		printErrors: true,
		filename: '',
		...options,
	}

	if (!Array.isArray(styles)) {
		styles = [styles]
	}

	css = css.normalize('NFC')
	return await replaceAllTokens(css, styles, options)
}

const replaceAllTokens = async (css, valueMaps, options) => {
	const tokens = tokenScanner.scanAll(css)

	// Work from back to front of the CSS string otherwise replacements at
	// the start will cause later tokens to hold the wrong start & end.
	tokens.reverse()

	for (const tk of tokens) {
		try {
			css = await attemptReplacement(css, valueMaps, tk)
		} catch (e) {
			handleError(e, tk, options)
		}
	}

	return css
}

const attemptReplacement = async (css, valueMaps, tk) => {
	tk = lookupProp(valueMaps, tk)

	if (tk.prop === undefined) {
		return css
	}

	tk = await resolveValue(tk)
	return replaceValue(css, tk)
}

const replaceValue = (css, tk) => {
	const prefix = css.slice(0, tk.start)
	const postfix = css.slice(tk.end, css.length)
	return `${prefix}${tk.value}${postfix}`
}

const handleError = (e, tk, options) => {
	if (options.printErrors) {
		const tkStr = JSON.stringify(tk, null, 2)
		const file = options.filename

		options.stderr(`P90 error: ${file}`)
		options.stderr(`${e.message}`)
		options.stdout(`P90 token: ${tkStr}`)
	}

	if (config.throwOnError) {
		throw e
	}
}
