export const countArgsLen = (css, tokenName) => {
	if (css.length === 0 || css[0] !== '(') {
		return 0
	}

	let len = 0

	for (; len < css.length; len++) {
		if (css[len] === ')') {
			break
		}
	}

	if (len >= css.length) {
		throw new Error(`Could not find closing paren for '${tokenName}'`)
	}

	len++
	return len
}

export const scanArgs = (argsStr) => {
	argsStr = argsStr.slice(1) // Remove opening paren
	if (argsStr.length === 1) {
		// Still has closing brace
		return []
	}

	const args = []

	while (argsStr !== null) {
		let arg
		;[argsStr, arg] = scanNextArg(argsStr)
		args.push(arg)
	}

	return args
}

const scanNextArg = (argsStr) => {
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
