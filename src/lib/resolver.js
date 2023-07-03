import { identifyType } from './lookup.js'

const implicitTypes = ['string', 'number', 'bigint', 'boolean', 'array']

export const resolveValue = async (tk) => {
	tk = deepClone(tk)

	switch (tk.type) {
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
			tk = await invokeFunction(tk)
			break

		case 'object':
			tk.value = mapToCssProps(tk)
			break

		default:
			throw new Error(`Can't resolve unsupported type '${tk.type}'`)
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

const invokeFunction = async (tk) => {
	tk.value = await Promise.resolve(tk.prop(...tk.args))

	const valueType = identifyType(tk.value)
	if (implicitTypes.includes(valueType)) {
		return tk
	}

	tk.recursed = true
	tk.type = valueType
	tk.prop = tk.value
	delete tk.value

	if (tk.type === 'function') {
		throw new Error(
			"To avoid inifinite recursion, you can't return a function from a function."
		)
	}

	return await resolveValue(tk)
}

const mapToCssProps = (tk) => {
	const result = []

	for (const cssProp in tk.prop) {
		const value = tk.prop[cssProp]
		checkCssPropValue(cssProp, value, tk)
		result.push(`${cssProp}: ${value.toString()}`)
	}

	const suffix = tk.suffix ? tk.suffix : ';\n'
	return result.join(';\n') + suffix
}

const checkCssPropValue = (cssProp, value, tk) => {
	const type = identifyType(value)

	if (!implicitTypes.includes(type)) {
		const errObj = {
			'CSS property': cssProp,
			"User's type": type,
			description: 'Type not allowed as a CSS property value',
			validTypes: implicitTypes,
		}

		const errMsg = JSON.stringify(errObj, null, 2)
		throw new Error(errMsg)
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