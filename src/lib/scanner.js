export const newScanFunc = (cssStr) => {
	// PLESAE NOTE: CBA to handle two code points for the first implementation.
	// TODO: Account for two code points per character.

	if (!cssStr || cssStr === "") {
		return null
	}

	let css = Array.from(cssStr)

	const scanNextToken = () => {
		if (!hasNextDollar()) {
			css = []
			return null
		}

		const lookupPath = scanLookupPath()		
		return lookupPath.join("")
	}

	const hasNextDollar = () => {
		const isEscapeChar = (i) => {
			return i+1 < css.length && css[i+1] === '$'
		}

		while (css.length > 0) {
			const i = css.indexOf("$")

			if (i === -1) {
				return false
			}

			if (!isEscapeChar(i)) {
				css.splice(0, i)
				return true
			}

			// Escaped $
			css.splice(0, i+2)
		}

		return false
	}

	const scanLookupPath = () => {
		const isEndOfP90Variable = (i) => {
			return css[i].match(/[^a-zA-Z0-9_\-]/)
		}

		let i = 1
		for (; i<css.length; i++) {
			if (isEndOfP90Variable(i)) {
				break
			}
		}

		const result = css.slice(0, i)
		css.splice(0, result.length)
		return result
	}

	return scanNextToken
}
