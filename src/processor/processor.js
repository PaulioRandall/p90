import tokenScanner from './token-scanner.js'
import { lookupProp } from './lookup.js'
import { resolveValue } from './resolver.js'

export const processCss = async (css, styles, config) => {
	config = {
		stdout: console.log,
		stderr: console.error,
		filename: '',
		throwOnError: false,
		printErrors: true,
		...config,
	}

	css = css.normalize('NFC')
	return await replaceAllTokens(css, styles, config)
}

const replaceAllTokens = async (css, valueMap, config) => {
	const tokens = tokenScanner.scanAll(css)

	// Work from back to front of the CSS string otherwise replacements at
	// the start will cause later tokens to hold the wrong start & end.
	tokens.reverse()

	for (const tk of tokens) {
		try {
			css = await attemptReplacement(css, valueMap, tk)
		} catch (e) {
			handleError(e, tk, config)
		}
	}

	return css
}

const attemptReplacement = async (css, valueMap, tk) => {
	tk = lookupProp(valueMap, tk)

	if (tk.prop === undefined) {
		return css // Ignore prop, it could be in the next valueMap
	}

	tk = await resolveValue(tk)
	return replaceValue(css, tk)
}

const replaceValue = (css, tk) => {
	const prefix = css.slice(0, tk.start)
	const postfix = css.slice(tk.end, css.length)
	return `${prefix}${tk.value}${postfix}`
}

const handleError = (e, tk, config) => {
	if (config.printErrors) {
		const tkStr = JSON.stringify(tk, null, 2)
		const file = config.filename

		config.stderr(`P90 error: ${file}`)
		config.stderr(`${e.message}`)
		config.stdout(`P90 token: ${tkStr}`)
	}

	if (config.throwOnError) {
		throw e
	}
}
