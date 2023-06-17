import adapter from '@sveltejs/adapter-auto'
import path from 'path'

import { applyStyles } from './src/lib/apply-styles.js'
import styles from './src/styles.js'

export default {
	kit: {
		adapter: adapter(),
		alias: {
			$routes: path.resolve('./src/routes'),
		},
	},
	preprocess: [applyStyles(styles)],
}
