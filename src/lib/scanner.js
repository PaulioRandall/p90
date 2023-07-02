// newScanner creates an object with functions for scanning a string,
// rune by rune, using regular expressions.
//
// PLESAE NOTE (TODO): CBA to handle multiple code points ATM.
//
// A rune, terminology borrowed from the Go programming language, is a alias
// for a unicode codepoint (even though the current implementation is not
// unicode aware).
//
// The scanner acts as an iterator with various query and read operations.
export const newScanner = (s) => {
	const runes = Array.from(s)
	const len = runes.length
	let idx = 0

	// index returns the iterators' index.
	const index = () => idx

	// isEmpty doesn't need explanation.
	const isEmpty = () => idx >= len

	// haveEnough returns true if there is at least n unread runes.
	const haveEnough = (n) => idx + n <= len

	// match returns true if there is a regex match on the next rune.
	const match = (regex) => !isEmpty() && runes[idx].match(regex)

	// slice returns a sub string using absolute indexes. It's interface is
	// identical to Array.slice.
	//
	// Using absolute indexes means it works on the whole string; ignoring the
	// iterator aspect of the scanner.
	//
	// It's intended for slicing parts of the string that have been iterated.
	const slice = (start, end) => {
		return runes.slice(start, end).join('')
	}

	// goto jumps to the absolute index i.
	const goto = (i) => {
		idx = i
	}

	// seek advances the iterator until a rune matches the regex.
	const seek = (regex) => {
		while (idx < len) {
			if (runes[idx].match(regex)) {
				return true
			}
			idx++
		}
		return false
	}

	// read returns the next rune; incrementing the index.
	const read = () => {
		if (isEmpty()) {
			throw new Error(`Can't read because EOF`)
		}

		const ru = runes[idx]
		idx++
		return ru
	}

	// accept reads and returns the next rune if there is a regex match. Null is
	// returned otherwise.
	const accept = (regex) => {
		return match(regex) ? read() : null
	}

	// expect reads and returns the next rune if there is a regex match. An error
	// is thrown otherwise.
	const expect = (regex) => {
		const ru = accept(regex)
		if (ru === null) {
			const got = isEmpty() ? 'EOF' : runes[idx]
			throw new Error(`Expected ${regex} but got ${got}`)
		}
		return ru
	}

	// readWhile reads runes until the regex fails to match; returns the matched
	// runes as a sub string.
	const readWhile = (regex) => {
		const result = []
		while (match(regex)) {
			result.push(runes[idx])
			idx++
		}
		return result.join('')
	}

	// skipSpaces reads until a non-whitespace rune or EOF is encountered.
	const skipSpaces = () => readWhile(/\s/)

	return {
		index,
		isEmpty,
		haveEnough,
		match,
		slice,
		goto,
		seek,
		read,
		accept,
		expect,
		readWhile,
		skipSpaces,
	}
}
