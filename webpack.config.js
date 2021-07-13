const HtmlWebpackPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const path = require('path');


"https://gist.githubusercontent.com/mbround18/d325e49f21e4d99a1ceea988458fc897/raw"
// noinspection JSValidateTypes
module.exports = {
  entry: './loader.js',
  mode: 'development',
  devServer: {
    historyApiFallback: true,
  },
  experiments: {
    asyncWebAssembly: true,
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
  },
  plugins: [
    new DotEnv({
      systemvars: true
    }),
    new HtmlWebpackPlugin({
      title: 'Showcase Yourself',
      meta: {
        charset: 'UTF-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    }),
    new WebpackManifestPlugin(),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, './client'),
    }),
    new FaviconsWebpackPlugin(path.resolve(__dirname, 'assets/user.png')),
  ],
  module: {
    rules: [
      {
        test: /\.(sass|css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')()],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
    },
  },
};
