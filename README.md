# Simple Professional Website

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Known Vulnerabilities](https://snyk.io/test/github/mbround18/showcase-yourself/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mbround18/showcase-yourself?targetFile=package.json)
[![Netlify Status](https://api.netlify.com/api/v1/badges/ca22d859-17fc-4007-9250-74881b51811b/deploy-status)](https://app.netlify.com/sites/silly-edison-e92c70/deploys)

Revamping in Rust+Yew for WebAssembly! 

<img width="25%" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2016%2F01%2F20%2F10%2F52%2Fmaintenance-1151312_960_720.png&f=1&nofb=1" />


## Setup

1. Clone or fork+clone this repository.
2. Run `yarn` to install dependencies
3. Create a config file and either add it to a gist or host it somewhere. [Click here to see an example of the config file](https://gist.github.com/mbround18/d325e49f21e4d99a1ceea988458fc897)
4. Set an env variable called `CONFIG_URL` to be your gist url or hosted config.json

  > If you are using gist, you can use `https://gist.githubusercontent.com/{username}/{gist-hash}/raw/{file}`

5. Build the app `yarn generate`
6. Publish your static files from `./dist`
