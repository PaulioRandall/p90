import { scanArgs, countArgsLen } from './scan-args.js'
import stringReader from './string-reader.js'

const scanAll = (cssStr) => {
	const f = scanFunc(cssStr)
	const result = []
	let tk = null

	while ((tk = f()) !== null) {
		result.push(tk)
	}

	return result
}

const scanFunc = (cssStr) => {
	// PLESAE NOTE: CBA to handle two code points for the first implementation.
	// TODO

	const sr = stringReader.new(cssStr)

	if (!cssStr || cssStr === '') {
		return null
	}

	let css = Array.from(cssStr)
	let idx = 0

	const scanNextToken = () => {
		if (!sr.seek(/\$/)) {
			return null
		}

		const start = sr.index()
		sr.skip()
		const name = sr.readWhile(/[a-zA-Z0-9_\-\.]/)

		return {
			start: start,
			end: sr.index(),
			raw: `$${name}`,
			path: name.split('.'),
			args: [],
		}
	}

	const jumpToNextDollar = () => {
		const isEscapeChar = (i) => {
			return i + 1 < css.length && css[i + 1] === '$'
		}

		while (css.length > 0) {
			const i = css.indexOf('$')

			if (i === -1) {
				return false
			}

			if (!isEscapeChar(i)) {
				sliceToken(i)
				return true
			}

			// Escaped $
			sliceToken(i + 2)
		}

		return false
	}

	const scanToken = () => {
		const len = nextTokenNameLen()
		if (len === 1) {
			throw new Error(`Dollar sign but token name missing`)
		}

		const tk = sliceToken(len)

		const argsLen = countArgsLen(css, tk.raw)
		if (argsLen === 0) {
			return tk
		}

		const argsTk = sliceToken(argsLen)
		tk.end = argsTk.end
		tk.raw += argsTk.raw

		const args = scanArgs(argsTk.raw)
		tk.args = args

		return tk
	}

	const nextTokenNameLen = () => {
		const isEndOfP90TokenName = (i) => {
			return i >= css.length || css[i].match(/[^a-zA-Z0-9_\-\.]/)
		}

		let len = 1

		while (!isEndOfP90TokenName(len)) {
			len++
		}

		return len
	}

	const sliceToken = (len) => {
		const v = css.slice(0, len).join('')

		const token = {
			start: idx,
			end: idx + len,
			raw: v,
			path: v.slice(1).split('.'),
			args: [],
		}

		idx += len
		css.splice(0, len)
		return token
	}

	return scanNextToken
}

export default {
	scanAll: scanAll,
	scanFunc: scanFunc,
}
