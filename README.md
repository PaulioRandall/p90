# P90

> NOTE: Support for Svelte has moved to [NP90](https://github.com/PaulioRandall/np90)

I just needed a bit of sugar upon my CSS.

A minimalist value replacement processor for CSS. Let plain JavaScript handle preprocessing logic, not a CSS mutant.

Honestly, this tool is straight up optimised for my tastes. The design trade-offs lean towards simplicity, readability, and flexibility more than writability. Complexity of configuration is almost entirely in the user's court.

**P90** scans CSS for **P90** tokens which are substituted with user defined values. It's really just an enhanced `string.replace`.

## 1. Plunder

Loot [`/src`](https://github.com/PaulioRandall/svelte-css-preprocessor/tree/trunk/src) for code to embed in your own projects.

## 2. Fork

And use as a starting point for your own CSS processor. See [Github](https://github.com/PaulioRandall/p90).

## 3. Import

Like any other package.

```json
{
	"devDependencies": {
		"p90": "v0.23.0"
	}
}
```

## Usage

There aren't really any conventions because the limitations of the design are good enough. Use kebab-case or camelCase if you don't like snake_case.

Organise value map as you please. Both nested and flat structures have their vices and virtues. **P90** variable names and user values can be whatever you like providing they meet the following criteria:

- Variable in CSS are prefixed with `$`.
- Double `$$` escapes, e.g. `$$$$` resolves to `$$`
- Objects and undefined values throw an error.
- Null values resolve to an empty string, trailing colons and semi-colons are removed.
- Function arguments are always strings. It's your responsibility to parse them.
- Returning a function from a function will result in an error.
- Promises are awaited and resolved to values, but not recursively!
- A single trailing colon, semi-colon, or whitespace character is preserved, except where the replacement value is _null_.

> Warning: I've made changes to this example that I haven't tested yet!

```js
import p90 from 'p90/svelte'

const styles = {
	text: {
		'line-height': '1.5em',
		size: {
			sm: '12px',
			md: '16px',
			lg: '24px',
			xl: '32px',
		},
	},
	color: {
		burly_wood: 'rgb(222, 184, 135)',
		jet_blue: 'rgb([30, 85, 175)',
	},
	pxToRem: (px, base = '16') => `${parseInt(px) / parseInt(base)}rem`,
}

const cssBefore = `
body {
	color: $color.jet_blue;
	font-size: $text.size.md;
	line-height: $text.line-height;
}

h1 {
	font-size: $text.size.xl;
}

p {
	margin-top: $pxToRem(20);
}
`

const cssAfter = p90(cssBefore, styles)
/*
`
body {
	color: rgb([30, 85, 175);
	font-size: 16px;
	line-height: 1.5em;
}

h1 {
	font-size: 32px;
}


p {
	margin-top: 1.25rem;
}
`
*/
```

There's no support for reading CSS from files or repositories because that's not in the project scope. [NP90](https://github.com/PaulioRandall/np90) is what you want for that. It builds on **P90** for Node based file processing.

## API

**Parameters**:

- **css**: CSS string.
- **styles**: Mapping of P90 variable names to values ([example](#usage)).
- **config**: Configuration ([Options](#options)).

```js
import p90 from 'p90'

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

## Options

```js
const options = {
	stdout: console.log,
	stderr: console.error,

	// If true, errors will be thrown immediately ending the processing.
	// Default is off beccause Svelte and various CSS checkers will usually tell
	// you where the errors are. They're better at it too.
	throwOnError: false,

	// Prints file name and token info when an error is encountered.
	printErrors: true,

	// Will be printed if printErrors === true.
	filename: '',
}
```

## Util

There exists some utility functions for common activities. You don't have to use them to use **P90**. If you don't like my approach to CSS code generation then write your own functions. It's plain JavaScript after all.

```js
import p90Util from 'p90/util'
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

### colorSchemes

Generates CSS color scheme media queries from a set of themes; goes hand-in-hand with [themeVariables](#themeVariables)

**Parameters**:

- **themes**: map of CSS colour schemes (themes).

```js
import { colorSchemes } from 'p90/util'

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
import { themeVariables } from 'p90/util'

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

## spacings

> TODO

## Algorithm

**This section is for those few who care about how P90 works underneath or wish to plunder its code to build their own parser.**

The [proccessor.js](./src/processor/processor.js) file is where everthing comes together and is the best place to start exploring.

We use a token data structure to keep all information about each substitution in one place. See [lexical analysis (Wikipedia)](https://en.wikipedia.org/wiki/Lexical_analysis) for a general overview to scanning. Each major step in the process clones the tokens before adding new information.

Given the following CSS:

```css
body {
	--result: $numbers.add(1, '2', "3");
	--escaped: '$$'
}
```


And the following value map:

```js
{
	numbers: {
		add: (...numbers) => {
			let result = 0.0
			for (const n of numbers) {
				result += parseFloat(n)
			}
			return result
		},
	}
}
```

### 1. Scan all tokens via [token-scanner.js](./src/processor/token-scanner.js)

[token-scanner.js](./src/processor/token-scanner.js) makes use of [string-reader.js](./src/processor/string-reader.js) which handles the reading and matching of symbols as well as mapping between symbol and codepoint indexes. It isloates the handling of surrogate pair UTF-16 codepoints.

```js
token_after_scanning = {
	escape: false, // True only when escaping
	start: 18, // Code point index
	end: 44, // Code point index
	prefix: '$',
	raw: `$numbers.add(1, '2', "3");`,
	suffix: ';', // One of ['', ';', ':']
	path: ['numbers', 'add'],
	args: ['1', '2', '3'],
}
```

Escape tokens are flagged as they need no value map lookup:

```js
escape_token = {
	escape: true,
	start: 54,
	end: 56,
	prefix: '$',
	raw: '$$',
	suffix: '',
	path: ['$'],
	args: [],
}
```

### 2. Look up the initial value (referred to as `prop`) in the users value map via [lookup.js](./src/processor/lookup.js)

`prop` does not hold the final value used for substitution. They will be resolved in the next step.

```js
token_after_lookup = {
	escape: false,
	start: 18,
	end: 44,
	prefix: '$',
	raw: `$numbers.add(1, '2', "3");`,
	suffix: ';',
	path: ['numbers', 'add'],
	args: ['1', '2', '3'],
	type: 'function', // From 'typeof' with additional custom type 'array'
	prop: (...numbers) => {
		let result = 0.0
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

For most types there is no change to `prop`, it's simply copied to `value`, but functions need to be invoked etc.

The resultant `value` should be usable for the CSS string substitution without need for further modification. The `type` field is used to determine how this is done. The suffix will be appended, except where the type is _"null"_.

```js
token_after_resolve = {
	escape: false,
	start: 18,
	end: 44,
	prefix: '$',
	raw: `$numbers.add(1, '2', "3");`,
	suffix: ';',
	path: ['numbers', 'add'],
	args: ['1', '2', '3'],
	type: 'function',
	prop: (...numbers) => {
		let result = 0.0
		for (const n of numbers) {
			result += parseFloat(n)
		}
		return result
	},
	value: '6;', // Notice the suffix has been appended

	// True if a function returned a null which invoked a recursive resolution.
	recursed?: false
}
```
