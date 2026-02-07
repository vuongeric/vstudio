import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { enhancedImages } from '@sveltejs/enhanced-img';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), enhancedImages()],

	kit: {
		adapter: adapter(),
		paths: {
			base: '/vstudio'
		},
		// Enable prerendering for better performance
		prerender: {
			entries: ['/', '/kit'],
			handleHttpError: 'warn'
		}
	}
};

export default config;
