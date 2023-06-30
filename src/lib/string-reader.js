const newStringReader = (s) => {
	const runes = Array.from(s)
	const len = runes.length
	let idx = 0

	const index = () => idx
	const isEmpty = () => idx >= len
	const haveEnough = (n) => idx + n <= len

	const seek = (regex) => {
		for (; idx < len; idx++) {
			if (runes[idx].match(regex)) {
				return true
			}
		}
		return false
	}

	const matchRune = (regex) => !isEmpty() && runes[idx].match(regex)

	const skip = () => readRune()
	const readRune = () => readRunes(1)[0]

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

	const readWhile = (regex) => {
		const result = []

		while (matchRune(regex)) {
			result.push(runes[idx])
			idx++
		}

		return result.join('')
	}

	const acceptRune = (regex) => {
		return matchRune(regex) ? readRune() : null
	}

	const expectRune = (regex) => {
		const ru = acceptRune(regex)
		if (ru === null) {
			throw new Error(`Expected ${regex} but got ${runes[idx]}`)
		}
		return ru
	}

	return {
		index,
		isEmpty,
		skip,
		seek,
		readWhile,
		acceptRune,
		expectRune,
	}
}

export default {
	new: newStringReader,
}
