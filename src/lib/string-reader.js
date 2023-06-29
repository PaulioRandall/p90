const newStringReader = (s) => {
	const runes = Array.from(s)
	const len = runes.length
	let idx = 0

	const index = () => idx
	const isEmpty = () => idx >= len
	const haveEnough = (n) => idx + n <= len

	const seek = (regex) => {
		// TODO
		// 1. Finds first regex match
		// 2. readRunes up until the match
		// Returns:
		// - true if found
		// - false if EOF
	}

	const matchRune = (regex) => !isEmpty() && runes[idx].match(regex)

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
		seek,
		acceptRune,
		expectRune,
	}
}

export default {
	new: newStringReader,
}