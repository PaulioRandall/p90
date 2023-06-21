export const newScanFunc = (cssStr) => {
	// PLESAE NOTE: CBA to handle two code points for the first implementation.
	// TODO: Account for two code points per character.

	if (!cssStr || cssStr === '') {
		return null
	}

	let css = Array.from(cssStr)
	let idx = 0

	const scanNextToken = () => {
		if (!hasNextDollar()) {
			css = []
			return null
		}

		return scanLookupPath()
	}

	const hasNextDollar = () => {
		const isEscapeChar = (i) => {
			return i + 1 < css.length && css[i + 1] === '$'
		}

		while (css.length > 0) {
			const i = css.indexOf('$')

			if (i === -1) {
				return false
			}

			if (!isEscapeChar(i)) {
				sliceOff(i)
				return true
			}

			// Escaped $
			sliceOff(i + 2)
		}

		return false
	}

	const scanLookupPath = () => {
		const isEndOfP90Variable = (i) => {
			return css[i].match(/[^a-zA-Z0-9_\-\.]/)
		}

		let i = 1
		for (; i < css.length; i++) {
			if (isEndOfP90Variable(i)) {
				break
			}
		}

		return sliceOff(i)
	}

	const sliceOff = (len) => {
		const v = css.slice(0, len).join('')

		const token = {
			start: idx,
			end: idx + len,
			raw: v,
			path: v.slice(1).split('.'),
		}

		idx += len
		css.splice(0, len)
		return token
	}

	return scanNextToken
}
