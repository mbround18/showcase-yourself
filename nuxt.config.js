export default {
  target: "static",
  env: {
    configUrl: process.env.CONFIG_URL || "http://localhost:3000/config.json",
  },
  head: {
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/js/uikit.min.js",
      },
      {
        src:
          "https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/js/uikit-icons.min.js",
      },
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/uikit@3.5.6/dist/css/uikit.min.css",
      },
    ],
  },
};
