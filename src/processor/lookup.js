export const lookupProp = (valueMap, tk) => {
	tk = structuredClone(tk)

	if (tk.escape) {
		tk.prop = '$'
	} else {
		tk.prop = findProp(valueMap, tk.path)
	}

	tk.type = identifyType(tk.prop)
	return tk
}

const findProp = (valueMap, path) => {
	let prop = valueMap

	for (const segment of path) {
		if (prop === undefined || prop === null) {
			return undefined // This is correct, only return null if last segment
		}

		prop = prop[segment]
	}

	return prop
}

export const identifyType = (prop) => {
	if (prop === undefined) {
		return 'undefined'
	}

	if (prop === null) {
		return 'null'
	}

	if (Array.isArray(prop)) {
		return 'array'
	}

	return typeof prop
}
