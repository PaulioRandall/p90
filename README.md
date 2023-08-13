# P90

A minimalist search and replace tool for preprocessing files.

Honestly, this tool is straight up optimised for me and my tastes. The design trade-offs lean towards simplicity, readability, and flexibility more than writability. Complexity of mapping values is almost entirely in the user's court.

**P90** scans CSS for **P90** tokens which are substituted with user defined values. It's really just an enhanced GREP using `string.replace`.

This tool is rather low level, language agnostic, and doesn't handle files. [**P69**](https://github.com/PaulioRandall/p69) provides Node based CSS preprocessing using **P90**; it has out of the box support for Svelte too.

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
