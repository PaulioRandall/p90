# P90

A minimalist search and replace tool for preprocessing files. It's straight up optimised for me and my tastes. The design trade-offs lean towards simplicity, readability, and flexibility more than writability.

**P90** scans CSS for **P90** tokens which are substituted with user defined values. It's really just an enhanced GREP using `string.replace`.

This tool is rather low level, language agnostic, and doesn't handle files. [**P69**](https://github.com/PaulioRandall/p69) provides Node based CSS preprocessing using **P90** with out of the box support for Svelte. The example below is CSS because that's what I originally designed it for.

```js
import p90 from 'p90'

// You can create any sort of utility functions you like.
const newSpacingFunc = (sizePx, base = 16) => {
	return (fmt = 'px') => {
		switch (fmt) {
			case 'px':
				return sizePx + 'px'
			case 'em':
				return sizePx / base + 'em'
			case 'rem':
				return sizePx / base + 'rem'
			default:
				throw new Error(`Unknown spacing fmt '${fmt}'`)
		}
	}
}

// You can configure this how you like.
// There's no convention, just do what works for you.
const valueMap = {
	text: {
		family: {
			helvetica: ['Helvetica', 'Arial', 'Verdana'],
		},
		size: {
			// https://utopia.fyi/
			md: 'clamp(1.06rem, calc(0.98rem + 0.39vw), 1.38rem)',
			xl: 'clamp(2.59rem, calc(2.32rem + 1.34vw), 3.66rem)',
		},
	},
	color: {
		base: 'rgb(255, 255, 255)',
		text: 'rgb(11, 19, 43)',
		link: 'rgb(20, 20, 255)',
		strong: 'Navy',
	},
	space: {
		sm: newSpacingFunc(8),
		md: newSpacingFunc(16),
		lg: newSpacingFunc(32),
	},
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

h1 {
	font-size: $text.size.xl;
	color: $color.strong;
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
	background: rgb(255, 255, 255);
}

p {
	font-family: 'Helvetica', 'Arial', 'Verdana';
	font-size: clamp(1.06rem, calc(0.98rem + 0.39vw), 1.38rem);
	color: rgb(11, 19, 43);
	margin-top: 1em;
}

h1 {
	font-size: clamp(2.59rem, calc(2.32rem + 1.34vw), 3.66rem);
	color: Navy;
}

strong {
	color: Navy;
}
`
*/

```

## Options

```js
// Options and their defaults.
const options = {
	// Prefix character 
	prefix: '$',

	// Logger for informational messages.
	stdout: console.log,

	// Logger for error messages.
	stderr: console.error,

	// If true, errors will be thrown rather than ignored.
	// This will immediately end processing.
	// Default is false because I use Svelte and it's good at
	// tell me where the errors are.
	throwOnError: false,

	// Print file name and token information when an error is
	// encountered.
	printErrors: true,

	// A note when printing errors, usually a filename or some
	// identifier that may aid you in debugging.
	errorNote: '¯\\_(ツ)_/¯',
}
```

## Real example

See [sveltekit-minimalist-template](https://github.com/PaulioRandall/sveltekit-minimalist-template) for an example in a runnable project.
