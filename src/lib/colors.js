export const rgbToColor = (name, rgb) => {
	const hasAlpha = rgb.length === 4
	const value = rgb.join(', ')
	return hasAlpha ? `rgba(${value})` : `rgb(${value})`
}

export const rgbsToColors = (rgb) => {
	const result = {}
	for (const name in rgb) {
		result[name] = rgbToColor(name, rgb[name])
	}
	return result
}

export const rgbNoAlpha = (rgb) => {
	return rgb.slice(0, 3)
}
