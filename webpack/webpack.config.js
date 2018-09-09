'use strict';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname, '..');

module.exports = {
  devtool: '#source-map',

  entry: [path.resolve(ROOT, 'src', 'index.js')],

  externals: ['react', 'react-dom'],

  mode: 'development',

  module: {
    rules: [
      {
        enforce: 'pre',
        include: [path.resolve(ROOT, 'src')],
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc',
          failOnError: true,
          failOnWarning: false,
          fix: true,
          formatter: eslintFriendlyFormatter,
        },
        test: /\.js$/,
      },
      {
        include: [path.resolve(ROOT, 'src'), path.resolve(ROOT, 'DEV_ONLY')],
        loader: 'babel-loader',
        test: /\.js$/,
      },
    ],
  },

  output: {
    devtoolModuleFilenameTemplate({absoluteResourcePath}) {
      return path.resolve(absoluteResourcePath).replace(/\\/g, '/');
    },
    filename: 'react-local-redux.js',
    library: 'ReactLocalRedux',
    libraryTarget: 'umd',
    path: path.resolve(ROOT, 'dist'),
    pathinfo: true,
    umdNamedDefine: true,
  },

  performance: {
    hints: false,
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.NamedModulesPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
};
