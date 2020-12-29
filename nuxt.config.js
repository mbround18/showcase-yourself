const tailwindConfig = {
	buildModules: ['@nuxt/typescript-build'],
	target: 'static',
	env: {
		configUrl: process.env.CONFIG_URL || 'http://localhost:3000/config.json'
	},
	head: {
		meta: [
			{charset: 'utf-8'},
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{
				hid: 'Personal Showcase',
				name: 'Personal Showcase',
				content: 'A website to showcase skills and social media links.'
			}
		]
	},
	build: {
		postcss: {
			// Add plugin names as key and arguments as value
			// Install them before as dependencies with npm or yarn
			plugins: {
				tailwindcss: {}
			},
			preset: {
				features: {
					// Fixes: https://github.com/tailwindcss/tailwindcss/issues/1190#issuecomment-546621554
					"focus-within-pseudo-class": false
				}
			}
		}
	},
	render: {
		static: {
			setHeaders(request) {
				request.setHeader('X-Frame-Options', 'ALLOWALL');
				request.setHeader('Access-Control-Allow-Origin', '*');
				request.setHeader('Access-Control-Allow-Methods', 'GET');
				request.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			}
		}
	}
};
export default tailwindConfig;
