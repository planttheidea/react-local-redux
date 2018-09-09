'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultConfig = require('./webpack.config');

const ROOT = path.resolve(__dirname, '..');
const PORT = 3000;

module.exports = Object.assign({}, defaultConfig, {
  cache: true,

  devServer: {
    clientLogLevel: 'none',
    compress: true,
    contentBase: './dist',
    host: 'localhost',
    inline: true,
    lazy: false,
    noInfo: false,
    port: PORT,
    quiet: false,
    stats: {
      colors: true,
      progress: true,
    },
  },

  entry: [path.resolve(ROOT, 'DEV_ONLY', 'index.js')],

  externals: undefined,

  module: Object.assign({}, defaultConfig.module, {
    rules: defaultConfig.module.rules.map(
      (rule) =>
        rule.loader === 'babel-loader'
          ? Object.assign({}, rule, {
            options: Object.assign({}, rule.options, {
              presets: ['@babel/react'],
            }),
          })
          : rule
    ),
  }),

  output: Object.assign({}, defaultConfig.output, {
    publicPath: `http://localhost:${PORT}/`,
  }),

  plugins: [...defaultConfig.plugins, new HtmlWebpackPlugin()],
});
