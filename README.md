# P90

A minimalist CSS pre-processor for Svelte. No need to learn fancy syntax.

The rest of the introduction is hidden within the examples because you really don't give a damn.

**Note**: Full unicode is not yet supported. 2 byte Unicode only so far.

## Choose your questline

With this project you have three options:

**1. Plunder**

Loot the [`./src/lib`](https://github.com/PaulioRandall/svelte-css-preprocessor/tree/trunk/src/lib) folder for code to embed in your own projects and packages.

**2. Fork and customise**

Fork the repository and use as a starting point for your own CSS pre-processor. See code in [Github](https://github.com/PaulioRandall/svelte-css-preprocessor).

**3. Import like any other package**

```json
{
	"devDependencies": {
		"p90": "v0.11.0"
	}
}
```

## Usage

### svelte.config.js

Add **p90** to the `preprocess` array in your `svelte.config.js`.

`./src/p90-styles.js` exports the config object we'll create next. Move and rename as you see fit.

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

Rename, move, and reorganise as you see fit.

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
	// P90 doesn't care what the theme names are but browsers do!
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

// Export either an object (style set) containing the key-value
// mappings or an array style sets each containing there own
// mappings.
//
// If p90 receives and array then they are applied sequentially
// so that the output of the first can be processed by the second.
// You'll generally want to avoid this since makes code hard to
// read and change; but I one or two fair use cases.
export default [
	// Here's the neat part... these key-value pairs are up to you.
	// - Undefined values throw an error.
	// - Promises are resolved to values.
	// - Null values resolve to an empty string.
	// - Objects are converted into CSS properties if called directly.
	//   But must only contain properties that are straight forward to
	//   stringify, i.e. string, number, bigint, and boolean.
	// - Objects and nulls remove a single trailing colon or semi-colon if
	//   present; everything else preserves colons and semi-colons.
	// - Use kebab-case or camelCase if you don't like snake_case.
	//
	// But above all... do what works, is easy to read, and easy to change!
	{
		props: null,

		rgb: rgbs,
		color: colors,

		highlight: {
			default: {
				'border-radius': '0.4rem',
				border: '10px solid transparent',
				transition: 'border 300ms ease-out',
			},
			hover: {
				border: '10px solid $theme.strong',
			},
		},
	},
	{
		color_schemes: renderColorSchemes(themes),
		theme: generateThemeVariables(themes),

		// Organise as you please.
		//
		// Both nesting and dead flat structures have their virtues.
		// I advise keeping nesting to a minimum, it's easier to read and navigate.
		font: {
			family: {
				// Silly. I know. But just an example of a function call.
				sans_serif: async () => {
					return ['sans-serif', 'Helvetica', 'Arial', 'Verdana']
				},
			},
			size: {
				// Constructed using utopia.fyi... Could these be constructed in code?
				sm: 'clamp(0.89rem, calc(0.85rem + 0.18vw), 1.03rem)',
				md: 'clamp(1.06rem, calc(0.98rem + 0.39vw), 1.38rem)',
				lg: 'clamp(1.25rem, calc(1.19rem + 0.31vw), 1.5rem)',
				xl: 'clamp(1.5rem, calc(1.41rem + 0.47vw), 1.88rem)',
			}
		}

		space: {
			md: '1rem',
			lg: '2rem',
			xl: '4rem',
		},

		screen: {
			phone_only: `(max-width: ${phone_max_width})`,
			tablet_only: `(min-width: ${tablet_portrait_min_width}) and (max-width: ${tablet_landscape_max_width})`,
			desktop_only: `(min-width: ${desktop_min_width})`,
			larger_devices: `(min-width: ${tablet_landscape_min_width})`,
		}
	}
]
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
		font-family: $font.family.sans_serif;
		font-size: $font.size.md;
	}
</style>
```

### +page.svelte

```html
<page>
	<h1>A Bohemian quest for simplicity</h1>

	<p>
		It took me about an hour to learn and write my first Svelte CSS
		pre-processor after deciding existing tooling was overweight for my needs.
		Refactoring reduced my solution to about 20 lines of code. It simply
		substituted named values like `$green` with whatever I configured `rgb(10,
		240, 10)`. I've added a handful of utility functions for common use cases
		and here we are.
	</p>

	<p>
		It was so simple that I wondered why we've invented a plethora of CSS like
		languages with needless diabolical syntax. Because no one had yet created
		Svelte! Why do complex transpiling when simply value substitution can do the
		job. Let JavaScript handle logic because that's what it's designed to do.
		You know, making use of languages we already know and hate.
	</p>

	<p>
		Please, have a ago at using, forking or plundering even if you intend to use
		a main stream tool. You'll start to realise just how bloated most software
		libraries are.
	</p>
</page>

<style>
	h1 {
		color: $theme.strong;
		font-size: $font.size.lg;
	}

	@media $screen.larger_devices {
		h1 {
			font-size: $font.size.xl;
		}
	}

	/*
		'$props:' resolves to null in this example. This means the variable will
		be removed from the CSS including the colon. This prevents most CSS
		checkers from failing when properties are inserted via an object value.
		
		It also doubles up as documentation.
	*/
	p {
		$props: $highlight.default;
	}
	p:hover {
		$props: $highlight.hover;
	}
</style>
```

## Util functions

There exists some utility functions for common activities. You don't have to use them to use **P90**. If you don't like the way I've approached CSS code generation then right your own functions. It's just plain JavaScript after all.

Some are really convenient while others are so trivial it'll be quicker to write your own than look them up.

```js
import p90Util from 'p90/util'
```

| Name                                                          | Does what?                                                                                                                                                            |
| :------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [scanAll](#scanAll)                                           | Given a CSS string returns all P90 tokens within.                                                                                                                     |
| [newScanFunc](#newscanfunc)                                   | Given a CSS string creates a function which can be called repeatedly to find all P90 tokens within.                                                                   |
| [rgbsToColors](#rgbstocolors)                                 | Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values.                                                                                                     |
| [renderColorSchemes](#rendercolorschemes)                     | Generates CSS color scheme media queries from a set of themes with CSS variables as values; goes hand-in-hand with [generateThemeVariables](#generatethemevariables). |
| [generateThemeVariables](#generatethemevariables)             | Generates a **set** of CSS variables from a set of themes; goes hand-in-hand with [renderColorSchemes](#rendercolorschemes).                                          |
| [buildColorSchemeMediaQueries](#buildcolorschememediaqueries) | Generates CSS color scheme media queries.                                                                                                                             |

### scanAll

You can pretty much ignore this function unless you want to scan **P90** tokens within CSS tags.

Given a CSS string returns all P90 tokens in the order they appear. It is wise to perform string substitution in reverse order otherwise the `start` and `end` fields of later tokens become useless due to the CSS string length changing.

**Parameters**:

- **css**: CSS string.

Use it like this:

```js
import { scanAll } from 'p90/util'

const tokens = scanAll(css)
tokens.reverse() // Because we have to substitute from back to front
```

### newScanFunc

You can pretty much ignore this function unless you want to scan CSS files into tokens.

Given a CSS string creates a function which is called repeatedly to find all **P90** tokens in the order they appear. It is wise to perform string substitution in reverse order otherwise the `start` and `end` fields of later tokens become useless due to the CSS string length changing.

**Parameters**:

- **css**: CSS string.

Use it like this:

```js
import { newScanFunc } from 'p90/util'

const f = newScanFunc(css)
const tokens = []
let tk = null

while ((tk = f()) !== null) {
	tokens.push(tk)
}

tokens.reverse() // Because we have to substitute from back to front
```

```js
example_token = {
	start: 9,
	end: 34,
	prefix: '$',
	raw: '$color.mix(blue, yellow);',
	suffix: ';', // One of ['', ';', ':']
	path: ['color', 'mix'],
	args: ['blue', 'yellow'],
}
```

### rgbsToColors

Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values.

**Parameters**:

- **rgbs**: map of RGB and RGBA arrays.

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

### renderColorSchemes

Generates CSS color scheme media queries from a set of themes; goes hand-in-hand with [generateThemeVariables](#generatethemevariables)

**Parameters**:

- **themes**: map of CSS colour schemes (themes).

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

**Parameters**:

- **themes**: map of CSS colour schemes (themes).

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

### buildColorSchemeMediaQueries

Generates CSS colour scheme media queries.

**Parameters**:

- **schemes**: map of CSS colour schemes.
- **global**: generate global CSS `:global(...)` (default: `true`).
- **toValue**: (prop, value) => "" (default: `` (p, v) => `${p}: ${v}`  ``).

```js
import { buildColorSchemeMediaQueries } from 'p90/util'

const schemes = {
	// P90 doesn't care what the scheme names are but CSS/browsers do!
	light: {
		color: [250, 250, 250],
		'background-color': [5, 10, 60],
	},
	dark: {
		color: [5, 10, 35],
		'background-color': [231, 245, 255],
	},
}

const toValue = (prop, rgb) => `${prop}: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
const mediaQueries = buildColorSchemeMediaQueries(schemes, false, toValue)
console.log(mediaQueries)
/*
`@media (prefers-color-scheme: light) {
	:root {
		color: rgb(250, 250, 250);
		background-color: rgb(5, 10, 60);
	}
}

@media (prefers-color-scheme: dark) {
	:root {
		color: rgb(5, 10, 35);
		background-color: rgb(231, 245, 255);
	}
}`
*/
```
