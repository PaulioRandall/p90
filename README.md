# P90

A minimalist CSS pre-processor for Svelte. No need to learn fancy syntax like other advanced CSS tooling.

The rest of the introduction is at the bottom of this README because you really don't give a damn.

## Choose your questline

With this project you have three options:

**1. Fork and customise**

Fork the repository and use as a starting point for your own CSS pre-processor. See code in [Github](https://github.com/PaulioRandall/svelte-css-preprocessor).

**2. Plunder**

Loot the [`./src/lib`](https://github.com/PaulioRandall/svelte-css-preprocessor/tree/trunk/src/lib) folder for code to embed in your own projects and packages.

**3. Import like any other package**

```json
{
	"devDependencies": {
		"p90": "v0.2.0"
	}
}
```

## Usage

### svelte.config.js

Import and add **p90** to the `preprocess` array in your `svelte.config.js`.

`./src/p90-styles.js` is our configuration file that we'll create in a minute. Move and rename as you see fit.

```js
// svelte.config.js
import { p90 } from 'p90'
import styles from './src/p90-styles.js'

export default {
  ...,
  preprocess: [p90(styles)],
  ...,
}
```

### p90-styles.js

```js
// ./src/p90-styles.js
import { rgbsToColors, generateThemeVars, renderColorSchemes } from 'p90/util'

const breakpoints = {
	phone_max_width: '599px',
	tablet_portrait_min_width: '600px',
	tablet_portrait_max_width: '899px',
	tablet_landscape_min_width: '900px',
	tablet_landscape_max_width: '1199px',
	desktop_min_width: '1200px',
}

const rgbs = {
	burly_wood: [222, 184, 135],
	ice_cream: [250, 250, 250],
	very_light_sky_blue: [231, 245, 255],
	jet_blue: [30, 85, 175],
	dark_navy_grey: [5, 10, 60],
	very_dark_navy: [5, 10, 35],
}

const colors = rgbsToColors(rgbs)

const themes = {
	// P90 doesn't care what the theme names are but CSS does!
	light: {
		base: colors.ice_cream,
		text: colors.dark_navy_grey,
	},
	dark: {
		base: colors.very_dark_navy,
		text: colors.very_light_sky_blue,
	},
}

export default {
	// Here's the neat part...
	// You can call these whatever you like.
	// Use kebab-case if you don't like snake_case.
	//
	// But above all... do what works, is easy to read, and easy to change!
	// Be consistent only to the point where consitency provides value.
	break: breakpoints,
	color_schemes: renderColorSchemes(themes),
	theme: generateThemeVars(themes),
	rgb: rgbs, // Probably don't need but meh.
	color: colors,
	font_family: {
		sans_serif: ['sans-serif', 'Helvetica', 'Arial', 'Verdana'],
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
	screen: {
		phone_only: `(max-width: ${phone_max_width})`,
		tablet_only: `(min-width: ${tablet_portrait_min_width}) and (max-width: ${tablet_landscape_max_width})`,
		desktop_only: `(min-width: ${desktop_min_width})`,
	},
}
```

## Util functions

There exists some utility functions for common activities. The cool part is you don't have to use them. If you don't like the way I've approached CSS code generation then right your own functions in your styles file.

Some of them are really convenient while others are so trivial I wouldn't blame you for spending 30 seconds crafting your own.

| Name                                                | Does what?                                                                                                   |
| --------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| [rgbToColor](#-rgbToColor)                         | Converts a three or four value RGB array to a CSS rgb value                                                  |
| [rgbsToColors](#-rgbsToColors)                     | Converts a map of three or four value RGB arrays to a map of CSS rgb values                                  |
| [rgbNoAlpha](#-rgbNoAlpha)                         | Removes alpha component of an RGB array                                                                      |
| [renderColorSchemes](#-renderColorSchemes)         | Creates CSS color scheme media queries from a set of themes; goes hand-in-hand with `generateThemeVariables` |
| [generateThemeVariables](###%20generateThemeVariables) | Creates a **set** of CSS variables from a set of themes; goes hand-in-hand with `renderColorSchemes`         |

### rgbToColor

Converts a three or four value RGB array to a CSS rgb value.

```js
import { rgbToColor } from 'p90/util'

const burlyWood = rgbToColor([222, 184, 135])
console.log(burlyWood)
// "rgb(222, 184, 135)"

const burlyWoodTransparent = rgbToColor([222, 184, 135, 0.5])
console.log(burlyWoodTransparent)
// "rgba(222, 184, 135, 0.5)"
```

### rgbsToColors

Converts a map of three or four value RGB arrays to a map of CSS rgb values.

```js
import { rgbsToColors } from 'p90/util'

const colors = rgbsToColors({
	burly_wood: [222, 184, 135],
	burly_wood_lucid: [222, 184, 135, 0.5],
	ice_cream: [250, 250, 250],
	jet_blue: [30, 85, 175],
	dark_navy_grey: [5, 10, 60],
	dark_navy_grey_lucid: [5, 10, 60, 0.5],
})

console.log(colors) // Use console.table for easy reading
/* `{
	burly_wood: "rgb(222, 184, 135)",
	burly_wood_lucid: "rgba(222, 184, 135, 0.5)",
	ice_cream: "rgb(250, 250, 250)",
	jet_blue: "rgb(30, 85, 175)",
	dark_navy_grey: "rgb(5, 10, 60)",
	dark_navy_grey_lucid: "rgba(5, 10, 60, 0.5)",
}` */
```

### rgbNoAlpha

Removes alpha component of an RGB array.

```js
import { rgbNoAlpha } from 'p90/util'

const rgba = [222, 184, 135, 0.5]
const rgb = rgbNoAlpha(rgba)

console.log(rgb)
// [222, 184, 135]
```

### renderColorSchemes

Creates CSS color scheme media queries from a set of themes; goes hand-in-hand with `generateThemeVariables`.

```js
import { renderColorSchemes } from 'p90/util'

const themes = {
	// P90 doesn't care what the theme names are but CSS does!
	light: {
		base: [250, 250, 250],
		text: [5, 10, 60],
	},
	dark: {
		base: [5, 10, 35],
		text: [231, 245, 255],
	},
}

const colorSchemes = renderColorSchemes(themes)
console.log(colorSchemes)
/*
`@media (prefers-color-scheme: light) {
	:global(:root) {
		--theme-base: rgb(250, 250, 250);
		--theme-text: rgb(5, 10, 60);
	}
}

@media (prefers-color-scheme: dark) {
	:global(:root) {
		--theme-base: rgb(5, 10, 35);
		--theme-text: rgb(231, 245, 255);
	}
}`
*/
```

### generateThemeVariables

Creates a **set** of CSS variables from a set of themes; goes hand-in-hand with `renderColorSchemes`.

```js
import { generateThemeVariables } from 'p90/util'

const themes = {
	// P90 doesn't care what the theme names are but CSS does!
	light: {
		base: [250, 250, 250],
		text: [5, 10, 60],
	},
	dark: {
		base: [5, 10, 35],
		text: [231, 245, 255],
	},
}

const themeVariables = generateThemeVariables(themes)
console.log(themeVariables)
/*
{
	base: "var(--theme-base)",
	text: "var(--theme-text)",
}
*/
```

## A Bohemian's quest for simplicity

It took me about an hour to learn and write my first CSS pre-processor after deciding existing tooling was grossly overweight for my needs. Refactoring reduced my solution to about 20 lines of code. It simply substituted named values like `$green` with whatever I configured `rgb(10, 240, 10)`. I've added a handful of common use case features and here we are.

It was so simple that I started wondering why we've invented a plethora of CSS like languages with needlessly diabolic syntax. Why do complex transpiling when simply value substitution can do the job. Let JavaScript or TypeScript handle logic because that's what they're good at (relative to CSS that is). You know, making use of languages we already know and hate.

Please, have a ago at forking or plundering even if you still intend to use a main stream tool. You'll start to realise just how bloated most developer tools are.
