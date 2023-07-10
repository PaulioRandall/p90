import { processCss } from '../processor/processor.js'

const TTY_RED = '\x1b[31m'
const TTY_YELLOW = '\x1b[33m'
const TTY_RESET = '\x1b[0m'

export const defaultMimeTypes = ['', 'text/css', 'text/p90']

export const p90 = (valueMap, options = {}) => {
	options = {
		stdout: (msg) => process.stdout.write(`\n${TTY_YELLOW}${msg}${TTY_RESET}`),
		stderr: (msg) => process.stderr.write(`\n${TTY_RED}${msg}${TTY_RESET}`),
		mimeTypes: defaultMimeTypes,
		...options,
	}

	return {
		style: async ({ content, markup, attributes, filename }) => {
			if (!isP90Stylesheet(options.mimeTypes, attributes.lang)) {
				return content
			}

			const config = {
				...options,
				filename,
			}

			return {
				code: await processCss(content, valueMap, config),
			}
		},
	}
}

const isP90Stylesheet = (mimeTypes, lang) => {
	lang = lang ? lang : ''
	return mimeTypes.includes(lang)
}
