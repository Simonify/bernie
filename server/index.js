process.env.NODE_PATH = [
  __dirname + '/../',
  __dirname + '/../shared/',
  __dirname + '/../src/'
].join(':');

require('module').Module._initPaths();
require('dotenv').config();

// Install `babel` hook for ES6
require('babel-core/register');
require('babel-polyfill');

const projectBasePath = require('path').resolve(__dirname, '..');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools');
const webpackIsomorphicConf = require('../webpack/webpack.isomorphic.config.js');
const getConfig = require('../config').default;

getConfig().then(function onConfig(config) {
  const webpackIsomorphicTools = new WebpackIsomorphicToolsPlugin(webpackIsomorphicConf);
  webpackIsomorphicTools.development(process.env.NODE_ENV === 'development');
  webpackIsomorphicTools.server(projectBasePath, function ready() {
    require('./createExpress').default(config, webpackIsomorphicTools);
  });
}).catch((err) => {
  console.log(err,err.stack.split('\n'));
});
