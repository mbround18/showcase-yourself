export default {
  buildModules: ['@nuxt/typescript-build'],
  target: "static",  
  env: {
    configUrl: process.env.CONFIG_URL || "http://localhost:3000/config.json",
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'Personal Showcase',
        name: 'Personal Showcase',
        content: 'A website to showcase skills and social media links.'
      }
    ],
    // script: [
    //   {
    //     src: "https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/js/uikit.min.js",
    //   },
    //   {
    //     src:
    //       "https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/js/uikit-icons.min.js",
    //   },
    // ],
    // link: [
    //   {
    //     rel: "stylesheet",
    //     href: "https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/css/uikit.min.css",
    //   },
    // ],
  },
  build: {
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        'tailwindcss': {}
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {}
      }
    }
  }
};
