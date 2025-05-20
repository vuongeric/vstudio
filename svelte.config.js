import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { enhancedImages } from '@sveltejs/enhanced-img';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), enhancedImages()],

	kit: {
		adapter: adapter({
			// Cloudflare Pages configuration
			routes: {
				handle: 'filesystem',
				// Include all URLs
				include: ['/*'],
				// Exclude static assets
				exclude: ['/_app/immutable/*', '/favicon.png']
			}
		}),
		// Enable prerendering for better performance
		prerender: {
			entries: ['*']
		}
	}
};

export default config;
