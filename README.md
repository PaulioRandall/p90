# P90

A minimalist search and replace tool for preprocessing files.

It's straight up optimised for me and my tastes. The design trade-offs lean towards simplicity and flexibility more than writability.

**P90** scans CSS for **P90** tokens which are substituted with user defined values. It's really just an enhanced GREP using `string.replace`.

This tool is rather low level, language agnostic, and doesn't handle the IO. [**P69**](https://github.com/PaulioRandall/p69) is usually what you want to use. It provides Node based CSS preprocessing using **P90** with out of the box support for Svelte.

The example below is CSS this tool is language agnostic.

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
	$: (n = 1) => '$'.repeat(n), // Used to escape the prefix
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

## Options and their defaults

```js
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

## Rules for value maps and usage

**Value map rules:**

1. There are no rules, standards, or conventions on how one should organise their value maps. Do what works, not the popular opinion.
2. Any value type is allowed except undefined, object, promise, and async functions.
3. Functions are invoked and the result returned as the value.
4. But a function cannot return undefined, object, promise, or another function of any kind.
5. Nulls are resolved to empty strings, discarding any suffix.
6. It's possible to pass an array of value maps `p69([...])`. Each value map is checked in turn for a valid value.

**In-code usage rules:**

1. All variables must be prefixed. The default is '$' but this can be changed via an option.
2. Functions can have arguments, e.g. `$func(1, 2, 3)`.
3. A function that has no arguments needs no parenthesis, e.g. `$func` is the same as `$func()`.
4. String arguments to functions do not require delimiters but single or double quotes may be applied, e.g. `$func(abc)` == `$func("abc")`.
5. String arguments must be quoted if it contains a comma or closing parenthesis.
6. There is no special escape character, instead add `$: (n=1) => '$'.repeat(n)` to the value map and use in code, e.g. `$$` => `$` and `$$(3)` => `$$$`.
7. Interesting useless side effect: you can pass arguments to a non-function; they're just not used in processing.
8. Don't make changes to the value map in the middle of processing if you value your sanity. I don't cloned it before using it.
