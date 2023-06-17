# TBD

A minimalist CSS pre-processor for Svelte.

It took me less than an hour to write my first CSS pre-processor within my website (Sveltekit). All it did was replace named values `$green` with whatever I configured `rgb(10, 240, 10)`. Super simple.

Have a ago at forking or plundering even if you still intend to use a main stream tool. Once you understand how they work you'll be in a better position to evaluate and choose a suitable main stream option.

## Using this package

With this project you have three options:

### 1. Fork and customise

Fork the repository and use as a starting point for your own CSS pre-processor. (Github)[https://github.com/PaulioRandall/svelte-css-preprocessor].

### 2. Plunder

Plunder the (`./src/lib`)[https://github.com/PaulioRandall/svelte-css-preprocessor/tree/trunk/src/lib] folder for code to embed in your own projects and packages.

### 3. Use like any other package

By adding it as a dev dependency...

```json
{
	"devDependencies": {
		"TBD": "v0.0.0"
	}
}
```

...installing...

```bash
npm i
```

...importing and applying...

```js
import { TBD } from 'TBD'
import styles from './src/styles.js'

export default {
  ...,
  preprocess: [TBD(styles)],
  ...,
```

...configuring styles...

```js
import { rgbsToColors, generateThemeVars, renderColorSchemes } from 'TBD'

// Write any functions for helping to populate the configuration first.
// It's plain JavaScript, no need to learn fancy syntax like other advanced
// CSS tooling.

// Generates 'rgb(r, g, b)' from '[r, g, b]'.
// Generates 'rgba(r, g, b, a)' from '[r, g, b, a]'.
//
// Example output:
//
// burly_wood: "rgb(222, 184, 135)"
// burly_wood_shadow: "rgba(222, 184, 135, 0.4)",
const color = rgbsToColors({
	burly_wood: [222, 184, 135],
	burly_wood_shadow: [222, 184, 135, 0.4],
	ice_cream: [250, 250, 250],
	very_light_sky_blue: [231, 245, 255],
	jet_blue: [30, 85, 175],
	very_dark_navy: [5, 10, 35],
	dark_navy_grey: [5, 10, 60],
})

// Generates 'var(--theme-name)' from light and dark theme maps.
//
// Use '$colorSchemes' within CSS to create the media queries.
//
// Example output:
//
// primary: 'var(--theme-primary)',
// text: 'var(--theme-text)',
// strong: 'var(--theme-strong)',
const theme = generateThemeVars({
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
})

export default {
	// It's entirely up to you what you put here.
	// Beaware that it all gets stringified except that objects are namespaces
	// (object paths) and thus itereated:
	//   colors: {
	//     burly_wood: "rgb(222, 184, 135)"
	//   }
	// And accessed in CSS as:
	//   "$colors.burly_wood"
	//
	// Arrays are converted to CSV strings, e.g:
	//   ['Nunito', 'sans-serif', 'Helvetica']
	// Becomes:
	//   "'Nunito', 'sans-serif', 'Helvetica'"

	color, // E.g. $color.jet_blue
	theme, // E.g. $theme.text

	// Here's some other common styling config you could add...

	font_family: {
		nunito: ['Nunito', 'sans-serif', 'Helvetica', 'Arial', 'Verdana'],
	},
	font_size: {
		// Constructed using utopia.fyi
		sm: 'clamp(0.89rem, calc(0.85rem + 0.18vw), 1.03rem)',
		md: 'clamp(1.06rem, calc(0.98rem + 0.39vw), 1.38rem)',
		lg: 'clamp(1.25rem, calc(1.19rem + 0.31vw), 1.5rem)',
		xl: 'clamp(1.5rem, calc(1.41rem + 0.47vw), 1.88rem)',
	},
	space: {
		sm: '0.5rem',
		md: '1rem',
		lg: '2rem',
		xl: '4rem',
	},
	break: {
		screen_min_width: '320px',
		phone_max_width: '599px',
		tablet_min_width: '600px',
	},
}
```

## Full list of commands

| Command               | Description                                                       |
| --------------------- | :---------------------------------------------------------------- |
| **`npm run fmt`**     | Format everything                                                 |
| **`npm run clean`**   | Delete build directory                                            |
| **`npm run build`**   | Build the project                                                 |
| **`npm run dev`**     | Runs in developer mode                                            |
| **`npm run preview`** | Builds project and starts as if it was in production              |
| **`npm run commit`**  | Do all checks needed to confirm changes are ready for integration |
