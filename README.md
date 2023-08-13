# P90

A minimalist search and replace tool for preprocessing files.

Honestly, this tool is straight up optimised for my tastes. The design trade-offs lean towards simplicity, readability, and flexibility more than writability. Complexity of mapping values is almost entirely in the user's court.

**P90** scans CSS for **P90** tokens which are substituted with user defined values. It's really just an enhanced GREP using `string.replace`.

> This tool is JavaScript specific and doesn't handle files. If you want to use this in your projects you'll probably want to use [**NP90**](https://github.com/PaulioRandall/np90).

```js
import p90 from 'p90'

const spacings = {
	px: (n) => n+'px',
	em: (n, base=16) => (n/base) + 'em',
	rem: (n, base=16) => (n/base) + 'rem',
}

const valueMap = {
	text: {
		family: ['Helvetica', 'Arial', 'Verdana'],
		size: {
			sm: "0.8rem",
			md: "1rem",
			lg: "1.4rem",
		}
	},
	color: {
		base: "rgb(10, 10, 30)",
		text: "rgb(255, 245, 235)",
		strong: "BurlyWood",
	},
	space: {
		sm: (fmt='px') => spacings[fmt](12)
		md: (fmt='px') => spacings[fmt](16)
		lg: (fmt='px') => spacings[fmt](32)
	}
}

const before = `
body {
	background: $color.base;
}

p {
	font-family: $text.family.helvetica;
	font-size: $text.size.md;
	color: $color.text;
	margin-top: $space.md(em);
}

strong {
	color: $color.strong;
}
`

const after = p90(valueMap, before)
console.log(after)
/*
`
body {
	background: rgb(10, 10, 30);
}

p {
	font-family: 'Helvetica', 'Arial', 'Verdana';
	font-size: 1rem;
	color: rgb(255, 245, 235);
	margin-top: 1em;
}

strong {
	color: BurlyWood;
}
`
*/

```

## CSS PreProcessor

A processor and utility functions for CSS preprocessing.

```js
import p90 from 'p90/css'
import { themeVariables, colorSchemes, rgbsToColors, spacings } from 'p90/css'
```

| Name                              | Does what?                                                                                                                                            |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [rgbsToColors](#rgbstocolors)     | Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values.                                                                                     |
| [colorSchemes](#colorschemes)     | Generates CSS color scheme media queries from a set of themes with CSS variables as values; goes hand-in-hand with [themeVariables](#themevariables). |
| [themeVariables](#themevariables) | Generates a **set** of CSS variables from a set of themes; goes hand-in-hand with [colorSchemes](#colorschemes).                                      |
| [spacings](#spacings)             | Generates a set of spacing functions.                                                                                                                 |

### rgbsToColors

Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values.

**Parameters**:

- **rgbs**: map of RGB and RGBA arrays.

```js
import { rgbsToColors } from 'p90/css'

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

### colorSchemes

Generates CSS color scheme media queries from a set of themes; goes hand-in-hand with [themeVariables](#themeVariables)

**Parameters**:

- **themes**: map of CSS colour schemes (themes).

```js
import { colorSchemes } from 'p90/css'

const themes = {
	// P90 doesn't care what the theme names are but browsers do!
	light: {
		base: [250, 250, 250],
		text: [5, 10, 60],
	},
	dark: {
		base: [5, 10, 35],
		text: [231, 245, 255],
	},
}

const scheme = colorSchemes(themes)
console.log(scheme)
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

### themeVariables

Generates a **set** of CSS variables from a set of themes; goes hand-in-hand with [colorSchemes](#colorschemes).

**Parameters**:

- **themes**: map of CSS colour schemes (themes).

```js
import { themeVariables } from 'p90/css'

const themes = {
	// P90 doesn't care what the theme names are but browsers do!
	light: {
		base: [250, 250, 250],
		text: [5, 10, 60],
	},
	dark: {
		base: [5, 10, 35],
		text: [231, 245, 255],
		meh: [0, 0, 0],
	},
}

const theme = themeVariables(themes)
console.log(theme)
/*
{
	base: "var(--theme-base)",
	text: "var(--theme-text)",
	meh: "var(--theme-meh)",
}
*/
```

### spacings

> TODO.

## Markdown Processor

> Planned.
