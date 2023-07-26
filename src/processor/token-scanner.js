import { newStringReader } from './string-reader.js'

const prefixRune = '$'

const scanAll = (css) => {
	const f = scanFunc(css)
	const result = []
	let tk = null

	while ((tk = f()) !== null) {
		result.push(tk)
	}

	return result
}

const escapeForRegex = (s) => {
	return s.replace(/[/\-\.\(\)\[\]\$\^\&\\]/g, '\\$&')
}

const scanFunc = (css) => {
	const sr = newStringReader(css)
	const prefix = escapeForRegex(prefixRune)
	const prefixRegex = new RegExp(prefix)

	const scanTokenFunc = () => {
		if (!sr.seek(prefixRegex)) {
			return null
		}

		const [start, startCp] = sr.makeBookmark()

		const startRune = sr.read()
		if (sr.accept(prefixRegex)) {
			const suffix = scanSuffix()
			const [end, endCp] = sr.makeBookmark()

			return {
				escape: true,
				start: startCp,
				end: endCp,
				prefix: prefixRune,
				raw: sr.slice(start, end),
				suffix: suffix,
				path: [prefixRune],
				args: [],
			}
		}

		const name = scanName()
		const args = scanParams(name)
		const suffix = scanSuffix()

		const [end, endCp] = sr.makeBookmark()

		return {
			escape: false,
			start: startCp,
			end: endCp,
			prefix: prefixRune,
			raw: sr.slice(start, end),
			suffix: suffix,
			path: name.split('.'),
			args: args,
		}
	}

	// NAME := { *alpha-numeric* | "_" | "-" | "." | "$" }
	const scanName = () => {
		return sr.readWhile(/[a-zA-Z0-9_\-\.\$]/)
	}

	// PARAMS := [ "(" ARGS ")" ]
	const scanParams = (name) => {
		const bookmark = sr.makeBookmark()

		sr.skipSpaces()
		if (!sr.accept(/\(/)) {
			sr.gotoBookmark(bookmark)
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

	// ARGS := [ ARG { "," ARG } ]
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

	// ARG := '"' { *any rune except '"' OR '\'* | '\"' | '\\' } '"'
	// ARG := "'" { *any rune except "'" OR "\"* | "\'" | "\\" } "'"
	// ARG := { *any rune except "\"* | "\\" }
	const scanArg = (name) => {
		sr.skipSpaces()

		const delim = sr.accept(/["']/)
		let arg = ''

		if (delim) {
			arg = scanQuotedArg(delim, name)
		} else {
			arg = sr.readWhile(/[^,)]/)
			arg = arg === '' ? null : arg
		}

		if (arg === null) {
			throw new Error(`Missing argument for '${name}'`)
		}

		return arg
	}

	const scanQuotedArg = (delim, name) => {
		const readingArg = new RegExp(`[^\\\\${delim}]`)
		const terminatingDelim = new RegExp(delim)

		let result = ''
		let escaped = false

		while (!sr.isEmpty()) {
			result += sr.readWhile(readingArg)

			const termintor = sr.accept(terminatingDelim)

			if (termintor && !escaped) {
				return result
			}

			if (termintor && escaped) {
				result += termintor
				escaped = false
				continue
			}

			const backSlash = sr.accept(/\\/)

			if (backSlash && !escaped) {
				escaped = true
				continue
			}

			if (backSlash && escaped) {
				result += backSlash
				escaped = false
				continue
			}
		}

		throw new Error(`Unterminated string for argument of '${name}'`)
	}

		// SUFFIX := ";" | ";" | *white-space*
	const scanSuffix = () => {
		const bookmark = sr.makeBookmark()

		sr.skipSpaces()
		let suffix = sr.accept(/[;:]/)

		if (!suffix) {
			sr.gotoBookmark(bookmark)
			suffix = sr.accept(/\s/)
		}

		if (!suffix) {
			sr.gotoBookmark(bookmark)
			return ''
		}

		return suffix
	}

	return scanTokenFunc
}

export default {
	scanAll: scanAll,
	scanFunc: scanFunc,
}
