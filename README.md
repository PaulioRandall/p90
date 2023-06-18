# P90

A minimalist CSS pre-processor for Svelte. No need to learn fancy syntax like other other CSS tooling.

The rest of the introduction is hidden within the examples because you really don't give a damn.

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
		"p90": "v0.4.0"
	}
}
```

## Usage

### svelte.config.js

Import and add **p90** to the `preprocess` array in your `svelte.config.js`.

`./src/p90-styles.js` is our configuration file that we'll create in a minute. Move and rename as you see fit.

```js
// svelte.config.js
import p90 from 'p90'
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
	// P90 doesn't care what the theme names are but CSS/browsers do!
	light: {
		base: colors.ice_cream,
		text: colors.dark_navy_grey,
		strong: colors.jet_blue,
	},
	dark: {
		base: colors.very_dark_navy,
		text: colors.very_light_sky_blue,
		strong: colors.burly_wood,
	},
}

// Export either an object (style set) containing the substitution mappings or
// an array style sets each containing there own substitution mappings.
//
// If p90 receives and array then it will apply each style set in turn so that
// the outputs of the first can be processed by the second. You generally want
// to avoid this as it can make code hard to read and change; but I have found
// one or two fair use cases.

export default {
	// Here's the neat part...
	// You can call these whatever you like.
	// Use kebab-case if you don't like snake_case.
	//
	// But above all... do what works, is easy to read, and easy to change!
	// Be consistent only to the point where consitency provides value.
	color: colors,
	color_schemes: renderColorSchemes(themes),
	theme: generateThemeVars(themes),
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
		larger_devices: `(min-width: ${tablet_landscape_min_width})`,
	},
}
```

### +layout.svelte

```html
<slot />

<style>
	/* prettier-ignore */
	$color_schemes

	:global(body) {
		background: $theme.base;
		color: $theme.text;
		font-family: $font_family.sans_serif;
		font-size: $font_size.md;
	}
</style>
```

### +page.svelte

```html
<page>
	<h1>A Bohemian quest for simplicity</h1>

	<p>
		It took me about an hour to learn and write my first CSS pre-processor after
		deciding existing tooling was overweight for my needs. Refactoring reduced
		my solution to about 20 lines of code. It simply substituted named values
		like `$green` with whatever I configured `rgb(10, 240, 10)`. I've added a
		handful of utility functions for common use cases and here we are.
	</p>

	<p>
		It was so simple that I started wondering why we've invented a plethora of
		CSS like languages with needless diabolical syntax. Why do complex
		transpiling when simply value substitution can do the job. Let JavaScript
		handle logic because that's what it's designed to do. You know, making use
		of languages we already know and hate.
	</p>

	<p>
		Please, have a ago at forking or plundering even if you intend to use a main
		stream tool. You'll start to realise just how bloated most software
		libraries are.
	</p>
</page>

<style>
	h1 {
		color: $theme.strong;
		font-size: $font_size.lg;
	}

	@media $screen.larger_devices {
		h1 {
			font-size: $font_size.xl;
		}
	}
</style>
```

## Util functions

There exists some utility functions for common activities. The cool part is you don't have to use them. If you don't like the way I've approached CSS code generation then right your own functions. It's just polain JavaScript after all.

Some of them are really convenient while others are so trivial it'll be quicker to write your own than look up the name in the docs.

```js
import p90Util from 'p90/util'
```

| Name                                              | Does what?                                                                                                                               |
| ------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| [rgbToColor](#rgbtocolor)                         | Converts an RGB or RGBA array to a CSS RGB or RGBA value.                                                                                |
| [rgbsToColors](#rgbstocolors)                     | Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values.                                                                        |
| [rgbWithAlpha](#rgbwithalpha)                     | Adds an alpha component to an RGB array. array                                                                                           |
| [rgbaWithoutAlpha](#rgbawithoutalpha)             | Removes the alpha component from an RGBA array. array                                                                                    |
| [renderColorSchemes](#rendercolorschemes)         | Generates CSS color scheme media queries from a set of themes; goes hand-in-hand with [generateThemeVariables](#generatethemevariables). |
| [generateThemeVariables](#generatethemevariables) | Generates a **set** of CSS variables from a set of themes; goes hand-in-hand with [renderColorSchemes](#rendercolorschemes).             |

### rgbToColor

Converts an RGB or RGBA array to a CSS RGB or RGBA value. See [rgbsToColors](#rgbstocolors) to map whole objects containing RGB arrays.

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

Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values. See [rgbToColor](#rgbtocolor) to map a single array.

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
/*
{
	burly_wood: "rgb(222, 184, 135)",
	burly_wood_lucid: "rgba(222, 184, 135, 0.5)",
	ice_cream: "rgb(250, 250, 250)",
	jet_blue: "rgb(30, 85, 175)",
	dark_navy_grey: "rgb(5, 10, 60)",
	dark_navy_grey_lucid: "rgba(5, 10, 60, 0.5)",
}
*/
```

### rgbWithAlpha

Adds an alpha component to an RGB array. See [rgbaWithoutAlpha](#rgbawithoutalpha) to remove.

```js
import { rgbWithAlpha } from 'p90/util'

const rgb = [222, 184, 135]
const rgba = rgbWithAlpha(rgb, 0.5)

console.log(rgba)
// [222, 184, 135, 0.5]
```

### rgbaWithoutAlpha

Removes the alpha component from an RGBA array. See [rgbWithAlpha](#rgbwithalpha) to add.

```js
import { rgbaWithoutAlpha } from 'p90/util'

const rgba = [222, 184, 135, 0.5]
const rgb = rgbaWithoutAlpha(rgba)

console.log(rgb)
// [222, 184, 135]
```

### renderColorSchemes

Generates CSS color scheme media queries from a set of themes; goes hand-in-hand with [generateThemeVariables](#generatethemevariables)

```js
import { renderColorSchemes } from 'p90/util'

const themes = {
	// P90 doesn't care what the theme names are but CSS/browsers do!
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

Generates a **set** of CSS variables from a set of themes; goes hand-in-hand with [renderColorSchemes](#rendercolorschemes).

```js
import { generateThemeVariables } from 'p90/util'

const themes = {
	// P90 doesn't care what the theme names are but CSS/browsers do!
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
