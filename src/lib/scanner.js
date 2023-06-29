export const newScanFunc = (cssStr) => {
	// PLESAE NOTE: CBA to handle two code points for the first implementation.
	// TODO: Account for two code points per character.

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
		const tk = sliceToken(len)

		if (css.length === 0 || css[0] !== '(') {
			return tk
		}

		const argsLen = nextTokenArgsLen(tk)
		const argsTk = sliceToken(argsLen)
		tk.end = argsTk.end
		tk.raw += argsTk.raw

		const args = parseTokenArgs(argsTk.raw)
		tk.args = args

		return tk
	}

	const nextTokenNameLen = () => {
		let len = 1

		while (len < css.length && !isEndOfP90TokenName(len)) {
			len++
		}

		if (len === 1) {
			throw new Error(`Dollar sign but token name missing`)
		}

		return len
	}

	const isEndOfP90TokenName = (i) => {
		return css[i].match(/[^a-zA-Z0-9_\-\.]/)
	}

	const nextTokenArgsLen = (nameToken) => {
		let len = 0

		for (; len < css.length; len++) {
			if (css[len] === ')') {
				break
			}
		}

		if (len >= css.length) {
			throw new Error(`Could not find end of arguments for '${nameToken.raw}'`)
		}

		len++
		return len
	}

	const parseTokenArgs = (argsStr) => {
		argsStr = argsStr.slice(1) // Remove opening paren
		if (argsStr.length === 1) {
			// Still has closing brace
			return []
		}

		const args = []

		while (argsStr !== null) {
			let arg
			;[argsStr, arg] = parseNextTokenArg(argsStr)
			args.push(arg)
		}

		return args
	}

	const parseNextTokenArg = (argsStr) => {
		const isArgDelim = (char) => char.match(/[,\)]/)
		let len = 0

		while (len < argsStr.length && !isArgDelim(argsStr[len])) {
			len++
		}

		const arg = argsStr.slice(0, len)
		argsStr = argsStr.slice(arg.length + 1).trim() // +1 accounts for delim
		argsStr = argsStr.length > 0 ? argsStr : null

		return [argsStr, arg]
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
