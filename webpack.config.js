const HtmlWebpackPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const path = require('path');

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
      systemvars: true,
    }),
    new HtmlWebpackPlugin({
      title: 'Showcase Yourself',
      meta: {
        charset: 'UTF-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    }),
    // new WebpackManifestPlugin(),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, './client'),
    }),
    new CopyPlugin({
      patterns: [{ from: 'assets', to: 'assets' }],
    }),
    new FaviconsWebpackPlugin(path.resolve(__dirname, 'assets/user.png')),
    new CopyPlugin({
      patterns: [{ from: 'config.schema.json', to: 'config.schema.json' }],
    }),
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
