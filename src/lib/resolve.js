export const resolveValue = async (tk) => {
	tk = deepClone(tk)

	switch (tk.type) {
		case 'undefined':
			tk.value = undefined
			break

		case 'null':
			tk.value = ''
			break

		case 'string':
		case 'number':
		case 'bigint':
		case 'boolean':
		case 'array':
			tk.value = tk.prop.toString()
			break

		case 'function':
			tk.value = await Promise.resolve(tk.prop(...tk.args))
			break

		case 'object':
			tk.value = mapToCssProps(tk.prop, tk)
			break

		default:
			throw new Error(`Can't resolve unknown type '${tk.type}'`)
	}

	return appendSuffix(tk)
}

const deepClone = (tk) => {
	// Because structuredClone don't clone functions.
	// We can simply cut the function out and paste it in after cloning.
	// In this case, there are no adverse side effects as the function does not
	// depend on the token object in anyway. The power of purity!
	if (tk.type === 'function') {
		return structuredCloneExtra(tk, 'prop')
	}
	return structuredClone(tk)
}

const structuredCloneExtra = (tk, ...refFieldNames) => {
	tk = { ...tk } // Shallow copy first to maintain the original.
	const refs = {}

	for (const name of refFieldNames) {
		refs[name] = tk[name]
		delete tk[name]
	}

	return {
		...structuredClone(tk),
		...refs,
	}
}

const mapToCssProps = (map, tk) => {
	const result = []

	for (const cssProp in map) {
		const value = map[cssProp]
		checkCssPropValue(cssProp, value, tk)
		result.push(`${cssProp}: ${value}`)
	}

	let suffix = ';\n'
	if (tk.suffix) {
		suffix = tk.suffix
	}

	return result.join(';\n') + suffix
}

const checkCssPropValue = (cssProp, value, tk) => {
	const validCssPropTypes = ['string', 'number', 'bigint', 'boolean']

	if (!validCssPropTypes.includes(typeof value)) {
		throw new Error(
			`For '${tk.raw}', the CSS property '${cssProp}' does not have a valid type`
		)
	}
}

const appendSuffix = (tk) => {
	const deadValue = tk.value === undefined || tk.value === null
	const dontSuffix = ['undefined', 'null', 'object']

	if (deadValue || dontSuffix.includes(tk.type)) {
		return tk
	}

	tk.value += tk.suffix
	return tk
}
