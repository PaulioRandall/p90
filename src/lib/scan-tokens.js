import { scanArgs, nextTokenArgsLen } from './scan-args.js'

export const newScanFunc = (cssStr) => {
	// PLESAE NOTE: CBA to handle two code points for the first implementation.
	// TODO

	if (!cssStr || cssStr === '') {
		return null
	}

	let css = Array.from(cssStr)
	let idx = 0

	const scanNextToken = () => {
		if (!jumpToNextDollar()) {
			idx += css.length
			css = []
			return null
		}

		return scanToken()
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

		if (css.length === 0 || css[0] !== '(') {
			return tk
		}

		const argsLen = nextTokenArgsLen(css, tk)
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
