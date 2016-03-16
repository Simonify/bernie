'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsoConfig = require('./webpack.isomorphic.config.js');
const webpackIsoTools = new WebpackIsomorphicToolsPlugin(webpackIsoConfig);
const baseConfig = require('./webpack.config.base');
const config = Object.create(baseConfig);
const cssLoader = ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader');

config.entry = {
  app: ['babel-polyfill', './src/index.js']
};

config.module.loaders.push(
  { test: /\.js$/, exclude: /node_modules|vendor/, loader: 'babel' },
  { test: /\.css$/, loader: cssLoader },
  { test: webpackIsoTools.regular_expression('images'), loader: 'url-loader?limit=10240' }
);

var prefixer = require('autoprefixer');
var precss = require('precss');

config.postcss = function postcss() {
  return [precss, prefixer];
};

config.plugins = [
  new ExtractTextPlugin('[name]-[hash].css'),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify('true'),
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false
    }
  }),
  webpackIsoTools
];

module.exports = config;
