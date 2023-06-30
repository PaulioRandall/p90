const newStringReader = (s) => {
	const runes = Array.from(s)
	const len = runes.length
	let idx = 0

	const index = () => idx
	const isEmpty = () => idx >= len
	const haveEnough = (n) => idx + n <= len

	const slice = (start, end) => {
		return runes.slice(start, end).join('')
	}

	const seek = (regex) => {
		for (; idx < len; idx++) {
			if (runes[idx].match(regex)) {
				return true
			}
		}
		return false
	}

	const matchRune = (regex) => !isEmpty() && runes[idx].match(regex)

	const read = () => readRunes(1)[0]

	const readRunes = (n) => {
		if (!haveEnough(n)) {
			throw new Error(
				`Not enough runes for reading, want ${n} but only have ${len - idx}`
			)
		}

		const result = runes.slice(idx, idx + n)
		idx += n
		return result
	}

	const accept = (regex) => {
		return matchRune(regex) ? read() : null
	}

	const expect = (regex) => {
		const ru = accept(regex)
		if (ru === null) {
			throw new Error(`Expected ${regex} but got ${runes[idx]}`)
		}
		return ru
	}

	const readWhile = (regex) => {
		const result = []

		while (matchRune(regex)) {
			result.push(runes[idx])
			idx++
		}

		return result.join('')
	}

	const skipWhitespace = () => readWhile(/\s/)

	return {
		index,
		isEmpty,
		slice,
		seek,
		read,
		accept,
		expect,
		readWhile,
		skipWhitespace,
	}
}

export default {
	new: newStringReader,
}
