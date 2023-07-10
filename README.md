# P90

A minimalist CSS processor with out of the box support for Svelte. Let plain JavaScript handle the logic, not a CSS mutant.

**P90** scans CSS for **P90** variables just like an ordinary compiler. But it does not parse, tokens are simply substituted with user defined values. No parsing or syntax trees needed.

The rest of the introduction is hidden within the examples because you don't really give a damn.

## Choose your questline

You have three options:

**1. Plunder**

Loot [`/src`](https://github.com/PaulioRandall/svelte-css-preprocessor/tree/trunk/src) for code to embed in your own projects.

**2. Fork**

And use as a starting point for your own CSS processor. See [Github](https://github.com/PaulioRandall/p90).

**3. Import**

Like any other package.

```json
{
	"devDependencies": {
		"p90": "v0.19.0"
	}
}
```

## Import like any other package

### svelte.config.js

Add **p90** to the _preprocess_ array in your _svelte.config.js_.

_./src/p90-styles.js_ exports the config object we'll create next.

```js
// svelte.config.js
import p90 from 'p90/svelte'
import styles from './src/p90-styles.js'

export default {
  ...,
  preprocess: [p90(styles)],
  ...,
}
```

```js
// Config and options with their defaults.
const config = {
	stdout: console.log,
	stderr: console.error,

	// If true, errors will be thrown immediately ending the processing.
	// Default is off beccause Svelte and various CSS checkers will usually tell
	// you where the errors are. They're better at it too.
	throwOnError: false,

	// Prints file name and token info when an error is encountered.
	printErrors: true,

	// List of accepted lang attibute values.
	// import { defaultMimeTypes } from 'p90'
	mimeTypes: [
		'', // Undefined, null, or empty lang attribute.
		'text/css',
		'text/p90',
	],
}
```

### p90-styles.js

Rename, move, and reorganise as you see fit.

There aren't really any conventions because the limitations of the design are good enough. Use kebab-case or camelCase if you don't like snake_case.

Organise as you please. Both nesting and dead flat structures have their virtues. **P90** variable names and user values can be whatever you like providing the meet the following criteria:

- Variable names must start with `$`.
- Double `$$` escapes, e.g. `$$$$` resolves to `$$`
- Undefined user values throw an error.
- Promise values are resolved to values (not recursive).
- Null values resolve to an empty string.
- Objects are converted into CSS properties if called directly. But must only contain properties that are straight forward to stringify, i.e. string, number, bigint, boolean, and array.
- Functions may return a `null` or `object` type which will be resolved recursively, but returning a function from a function will result in an error.
- Trailing colons and semi-colons are preserved, except for:
  - _Nulls_: which remove a single instance if suffix is present.
  - _Objects_: which will appended `;\n` if no suffix is present.

> I've made so many changes to this example that it probably contains a few errors. I have a TODO to rewrite it.

```js
// ./src/p90-styles.js
import { rgbsToColors, generateThemeVars, renderColorSchemes } from 'p90/util'

const breakpoints = {
	phone_max_width: '599px',
	tablet_landscape_min_width: '900px',
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

// Export either an object (value map) containing the key-value
// mappings or an array of objects each containing there own
// mappings.
//
// If p90 receives and array then the value maps are applied
// sequentially so that the output of the first can be processed
// by the second. You'll generally want to avoid this since makes
// code hard to read and change. But there maybe fair use cases.
export default [
	{
		props: null,

		rgb: rgbs,
		color: colors,

		colorWithAlpha: (color, alpha) => {
			const rgb = rgbs[color]

			// Function arguments are always strings.
			// It is up to you to parse them into numbers etc.
			const a = parseFloat(alpha)

			const result = [...rgb]

			if (rgb.length === 3) {
				result.push(a)
			} else {
				result[3] = a
			}

			return result
		},

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

		color_schemes: renderColorSchemes(themes),
		theme: generateThemeVariables(themes),

		font: {
			family: {
				sans_serif: ['sans-serif', 'Helvetica', 'Arial', 'Verdana'],
			},
			size: {
				// Constructed using utopia.fyi... Could these be constructed in code?
				md: 'clamp(1.06rem, calc(0.98rem + 0.39vw), 1.38rem)',
				lg: 'clamp(1.25rem, calc(1.19rem + 0.31vw), 1.5rem)',
				xl: 'clamp(1.5rem, calc(1.41rem + 0.47vw), 1.88rem)',
			}
		}

		screen: {
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
		pre-processor after deciding existing tooling was too obese for my needs.
		Refactoring reduced my solution to about 20 lines of code. It simply
		substituted named values like `$green` with whatever I configured `rgb(10,
		240, 10)`. I've enhanced it a little and added a handful of utility
		functions for common use cases; that's it.
	</p>

	<p>
		It was so simple that I wondered why we drag around a plethora of CSS like
		languages with needless diabolical syntax. Because it's easier to use an
		overweight tool you know than invest effort in adapting to the new
		environment.
	</p>

	<p>
		And why do slow complex transpiling when fast and simple value substitution
		can do the job. Let JavaScript handle logic, not a CSS mutant, because
		that's what JavaScript is designed to do. You know, making use of languages
		we already know and hate.
	</p>
</page>

<style>
	h1 {
		color: $theme.strong;
		font-size: $font.size.lg;

		/* You don't have to put single or double quotes around string arguments */
		/* But it helps */
		background-color: $colorWithAlpha('burly_wood', 0.2);
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

## Process function

If you're not working in Svelte you can use the underlying processor. This project doesn't depend on anything other than _Jest_; even that's a _devDependency_.

Currently there is no support for reading CSS from files or repositories. But I'll consider adding it if a use case pops up or, in the unlikely event, through popular demand.

```js
import p90 from 'p90/processor'
```

**Parameters**:

- **css**: CSS string.
- **styles**: Mapping of P90 variable names to values ([example](#p90-stylesjs)).
- **config**: Configuration and options ([docs](#config)).

```js
import p90 from 'p90/processor'

function processCss() {
	const cssBefore = '{ color: $color.blue; }'

	const styles = {
		color: {
			blue: '#2222FF',
		}
	}

	const config = {
		filename: 'main.css',
		throwOnError: true,
	}

	const cssAfter = await p90(cssBefore, styles, config)

	console.log(cssAfter)
	// '{ color: #2222FF; }'
}
```

### Config

```js
// Config and options with their defaults.
const config = {
	stdout: console.log,
	stderr: console.error,

	// Name of file being processed so it can be printed upon error.
	filename: '',

	// If true, errors will be thrown immediately ending the processing.
	// Default is off beccause Svelte and various CSS checkers will usually tell
	// you where the errors are. They're better at it too.
	throwOnError: false,

	// Prints file name and token info when an error is encountered.
	printErrors: true,
}
```

## Util functions

There exists some utility functions for common activities. You don't have to use them to use **P90**. If you don't my approach to CSS code generation then write your own functions. It's plain JavaScript after all.

```js
import p90Util from 'p90/util'
```

| Name                                              | Does what?                                                                                                                                                            |
| :------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| [rgbsToColors](#rgbstocolors)                     | Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values.                                                                                                     |
| [renderColorSchemes](#rendercolorschemes)         | Generates CSS color scheme media queries from a set of themes with CSS variables as values; goes hand-in-hand with [generateThemeVariables](#generatethemevariables). |
| [generateThemeVariables](#generatethemevariables) | Generates a **set** of CSS variables from a set of themes; goes hand-in-hand with [renderColorSchemes](#rendercolorschemes).                                          |     |

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

const themeVariables = generateThemeVariables(themes)
console.log(themeVariables)
/*
{
	base: "var(--theme-base)",
	text: "var(--theme-text)",
}
*/
```

## Algorithm

**This section is for those few who care about how P90 works underneath or wish to plunder its code to build their own parser.**

The [proccessor](./src/processor/processor.js) file is where everthing comes together and is the best place to start exploring.

We use a token data structure to keep all information about each substitution in one place. See [lexical analysis (Wikipedia)](https://en.wikipedia.org/wiki/Lexical_analysis) for a general overview to scanning. Each major step in the process clones the tokens and then adds new information.

### 1. Scan all tokens via [token-scanner.js](./src/processor/token-scanner.js)

[token-scanner.js](./src/processor/token-scanner.js) makes use of [string-reader.js](./src/processor/string-reader.js) which handles the reading and matching of symbols as well as mapping between symbol and codepoint indexes. It isloates the handling of surrogate pair UTF-16 codepoints.

```js
token_after_scanning = {
	escape: false, // True only when escaping
	start: 9, // Code point index
	end: 31, // Code point index
	prefix: '$',
	raw: '$numbers.add(1, 2, 3);',
	suffix: ';', // One of ['', ';', ':']
	path: ['numbers', 'add'],
	args: ['1', '2', '3'],
}
```

Escape tokens are flagged as they need no value map lookup:

```js
escape_token = {
	escape: true,
	start: 10,
	end: 12,
	prefix: '$',
	raw: '$$',
	suffix: '',
	path: ['$'],
	args: [],
}
```

### 2. Look up the initial value (referred to as `prop`) in the users value map via [lookup.js](./src/processor/lookup.js)

`prop` does not hold the final value used for substitution. They will be resolved in the next step. For most types there is no change but functions need to be invoked, objects transformed, etc.

```js
token_after_lookup = {
	escape: false,
	start: 9,
	end: 31,
	prefix: '$',
	raw: '$numbers.add(1, 2, 3);',
	suffix: ';',
	path: ['numbers', 'add'],
	args: ['1', '2', '3'],
	type: 'function', // From 'typeof' with additional custom type 'array'
	prop: (...numbers) => {
		let result = 0
		for (const n of numbers) {
			result += parseFloat(n)
		}
		return result
	},
}
```

```js
import { identifyType } from './src/processor/lookup.js'

identifyType(undefined) // 'undefined'
identifyType(null) // 'null'
identifyType(0) // 'number'
identifyType(12345678987654321) // 'bigint'
identifyType('') // 'string'
identifyType(true) // 'boolean'
identifyType([]) // 'array'
identifyType({}) // 'object'
identifyType(() => '') // 'function'
```

### 3. Resolve the property to a value via [resolve.js](./src/processor/resolver.js)

The resultant `value` should be usable for the CSS string substitution without need for further modification.

The `type` field is used to determine how this is done. The suffix will be appended, except where the type is _"null"_. If the type is _"object"_ and `suffix` is empty then _;\n_ is appended.

Functions may return a _null_ or _object_ type which will be resolved recursively. But returning a function from a function will result in an error. There's no need, just call it before returning.

```js
token_after_resolve = {
	escape: false,
	start: 9,
	end: 35,
	prefix: '$',
	raw: `$numbers.add(1, '2', "3");`,
	suffix: ';',
	path: ['numbers', 'add'],
	args: ['1', `2`, `3`],
	type: 'function',
	prop: (...numbers) => {
		let result = 0
		for (const n of numbers) {
			result += parseFloat(n)
		}
		return result
	},
	value: '6;', // Notice the suffix has been appended

	// True if a function returned a null or object which required a
	// recursive resolution.
	recursed?: false
}
```
