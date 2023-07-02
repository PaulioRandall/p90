import { newScanner } from './scanner.js'

const scanAll = (css, prefixRune) => {
	const f = scanFunc(css, prefixRune)
	const result = []
	let tk = null

	while ((tk = f()) !== null) {
		result.push(tk)
	}

	return result
}

const scanFunc = (css, prefixRune = '$') => {
	// PLESAE NOTE: CBA to handle two code points for the first implementation.
	// TODO

	const escapeForRegex = (s) => {
		return s.replace(/[/\-\.\(\)\[\]\$\^\&\\]/g, '\\$&')
	}

	const sr = newScanner(css)
	const prefix = escapeForRegex(prefixRune)
	const prefixRegex = new RegExp(prefix)

	const scanName = () => {
		return sr.readWhile(/[a-zA-Z0-9_\-\.\$]/)
	}

	const scanSuffix = () => {
		const bookmark = sr.index()

		sr.skipSpaces()
		const suffix = sr.accept(/[;:]/)

		if (!suffix) {
			sr.goto(bookmark)
			return ''
		}

		return suffix
	}

	const scanParams = (name) => {
		sr.skipSpaces()
		if (!sr.accept(/\(/)) {
			return []
		}

		sr.skipSpaces()
		if (sr.accept(/\)/)) {
			return []
		}

		const args = scanArgs(name)
		sr.expect(/\)/)

		return args
	}

	const scanArgs = (name) => {
		const args = []

		while (true) {
			const arg = scanArg(name)
			args.push(arg)

			sr.skipSpaces()
			if (!sr.accept(/,/)) {
				break
			}
		}

		return args
	}

	const scanArg = (name) => {
		sr.skipSpaces()

		const arg = sr.readWhile(/[^,)]/)
		if (arg === '') {
			throw new Error(`Missing argument for '${name}'`)
		}

		return arg
	}

	return () => {
		if (!sr.seek(prefixRegex)) {
			return null
		}

		const start = sr.index()
		const startRune = sr.read()
		const name = scanName()
		const args = scanParams(name)
		const suffix = scanSuffix()
		const end = sr.index()

		return {
			start: start,
			end: end,
			prefix: prefixRune,
			raw: sr.slice(start, end),
			suffix: suffix,
			path: name.split('.'),
			args: args,
		}
	}
}

export default {
	scanAll: scanAll,
	scanFunc: scanFunc,
}
