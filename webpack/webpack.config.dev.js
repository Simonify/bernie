const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const baseConfig = require('./webpack.config.base');
const startExpress = require('./utils/startExpress');
const webpackIsoConfig = require('./webpack.isomorphic.config.js');
const webpackIsoTools = new WebpackIsomorphicToolsPlugin(webpackIsoConfig).development();
const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT, 10) + 1;
const PUBLIC_PATH = `//${HOST}:${PORT}/assets/`;

const config = Object.create(baseConfig);

config.output.publicPath = PUBLIC_PATH;
config.devtool = 'eval';
config.entry = {
  app: [
    `webpack-hot-middleware/client?path=//${HOST}:${PORT}/__webpack_hmr`,
    'babel-polyfill',
    './src/index.js'
  ]
};

config.module.loaders.push(
  { test: /\.js$/, exclude: /node_modules|vendor/, loader: 'babel' },
  { test: /\.css$/, loader: 'style!css!postcss' },
  { test: webpackIsoTools.regular_expression('images'), loader: 'url?limit=10240' }
);

var prefixer = require('autoprefixer');
var postcssImport = require('postcss-import');
var precss = require('precss');

config.postcss = function postcss(_webpack) {
  return [postcssImport({ addDependencyTo: _webpack }), precss, prefixer];
};

config.plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify('true'),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }),
  webpackIsoTools,
  function plugin() { this.plugin('done', startExpress); }
];

module.exports = {
  webpack: config,
  server: {
    port: PORT,
    host: HOST,
    options: {
      inline: true,
      noInfo: true,
      publicPath: config.output.publicPath,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunksModule: false
      }
    }
  }
};
