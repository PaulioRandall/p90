import adapter from '@sveltejs/adapter-auto'
import path from 'path'

import { applyStyles } from 'p90'
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
