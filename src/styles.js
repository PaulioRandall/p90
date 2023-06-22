import {
	rgbsToColors,
	renderColorSchemes,
	generateThemeVariables,
} from 'p90/util'

const rgb = {
	rosy_red: [255, 145, 145],
	blood_red: [115, 16, 16],
	burly_wood: [222, 184, 135],
	burly_wood_shadow: [222, 184, 135, 0.4],
	ice_cream: [250, 250, 250],
	very_light_sky_blue: [231, 245, 255],
	jet_blue: [30, 85, 175],
	very_dark_navy: [5, 10, 35],
	dark_navy_grey: [5, 10, 60],
}

const color = rgbsToColors(rgb)

const themes = {
	light: {
		primary: color.ice_cream,
		text: color.dark_navy_grey,
		link: color.rosy_red,
		strong: color.jet_blue,
		// ...
	},
	dark: {
		primary: color.very_dark_navy,
		text: color.very_light_sky_blue,
		strong: color.burly_wood,
		link: color.blood_red,
		// ...
	},
}

export default {
	colorSchemes: renderColorSchemes(themes),
	theme: generateThemeVariables(themes),

	rgb,
	color,

	font_family: {
		sans_serif: ['sans-serif', 'Arial', 'Verdana'],
	},

	font_size: {
		// Constructed using utopia.fyi
		md: 'clamp(1.06rem, calc(0.98rem + 0.39vw), 1.38rem)',
		lg: 'clamp(1.5rem, calc(1.41rem + 0.47vw), 1.88rem)',
	},

	space: {
		md: '1rem',
		lg: '2rem',
		xl: '4rem',
	},
}
