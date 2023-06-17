import {
	rgbsToColors,
	generateThemeVars,
	renderColorSchemes,
} from '$lib/TBD.js'

// Write any helper functions in plain JavaScript, no need to learn fancy
// syntax like other advanced CSS tooling.

const rgb = {
	burly_wood: [222, 184, 135],
	burly_wood_shadow: [222, 184, 135, 0.4],
	ice_cream: [250, 250, 250],
	very_light_sky_blue: [231, 245, 255],
	jet_blue: [30, 85, 175],
	very_dark_navy: [5, 10, 35],
	dark_navy_grey: [5, 10, 60],
}

// Generates 'rgb(r, g, b)' from [r, g, b].
// Generates 'rgba(r, g, b, a)' from [r, g, b, a].
//
// Example output:
//
// burly_wood: "rgb(222, 184, 135)"
// burly_wood_shadow: "rgba(222, 184, 135, 0.4)",
const color = rgbsToColors(rgb)

const themes = {
	light: {
		primary: color.ice_cream,
		text: color.dark_navy_grey,
		strong: color.jet_blue,
		// ...
	},
	dark: {
		primary: color.very_dark_navy,
		text: color.very_light_sky_blue,
		strong: color.burly_wood,
		// ...
	},
}

export default {
	// It's entirely up to you what you put here.
	// Beaware that everything gets stringified except that objects are
	// namespaces (object paths) and thus itereated:
	//   colors: {
	//     burly_wood: "rgb(222, 184, 135)"
	//   }
	// And accessed in CSS as:
	//   $colors.burly_wood

	// Arrays are converted to CSV strings, e.g:
	//   [222, 184, 135]
	// Becomes:
	//   222, 184, 135
	rgb, // $rgb.jet_blue   => 30, 85, 175
	color, // $color.jet_blue => rgb(30, 85, 175)

	// We can pass functions too.
	//
	// $colorWithOpacity("jet_blue", 0.5)
	colorWithOpacity: (name, opacity) => `rgb(${rgb[name]}, ${opacity})`,

	/*
	renderColorSchemes renders the media query color schemes (themes):

	@media (prefers-color-scheme: light) {
		:global(:root) {
			--theme-primary: rgb(255, 255, 255);
			--theme-text: rgb(11, 19, 43);
			--theme-strong: rgb(20, 20, 255);
		}
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--theme-primary: rgb(5, 10, 35);
			--theme-text: rgb(231, 245, 255);
			--theme-strong: rgb(255, 145, 145);
		}
	}
	*/
	colorSchemes: renderColorSchemes(themes),

	// Generates CSS variables 'var(--theme-name)' from the themes. E.g:
	//
	// {
	//   primary: 'var(--theme-primary)'
	//   text:    'var(--theme-text)'
	//   strong:  'var(--theme-strong)'
	// }
	//
	// $theme.text => var(--theme-text)
	theme: generateThemeVars(themes),

	// Here's some other styling you could do...

	font_family: {
		// $font_family.nunito => 'Nunito', 'sans-serif', 'Arial', 'Verdana'
		nunito: ['Nunito', 'sans-serif', 'Arial', 'Verdana'],
	},

	font_size: {
		// Constructed using utopia.fyi
		// $font_size.sm => clamp(0.89rem, calc(0.85rem + 0.18vw), 1.03rem)
		sm: 'clamp(0.89rem, calc(0.85rem + 0.18vw), 1.03rem)',
		md: 'clamp(1.06rem, calc(0.98rem + 0.39vw), 1.38rem)',
		lg: 'clamp(1.25rem, calc(1.19rem + 0.31vw), 1.5rem)',
		xl: 'clamp(1.5rem, calc(1.41rem + 0.47vw), 1.88rem)',
	},

	space: {
		// $space.sm => 0.5rem
		sm: '0.5rem',
		md: '1rem',
		lg: '2rem',
		xl: '4rem',
	},

	break: {
		// $break.phone_max_width => 599px
		screen_min_width: '320px',
		phone_max_width: '599px',
		tablet_min_width: '600px',
	},
}
