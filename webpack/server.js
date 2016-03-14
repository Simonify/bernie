'use strict';

const debug = require('debug');
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.dev');

const app = new express();
const webpacked = webpack(config.webpack);

debug.enable('dev');

app.use(webpackDevMiddleware(webpacked, config.server.options));
app.use(webpackHotMiddleware(webpacked));

app.listen(config.server.port, config.server.host, (error) => {
  if (error) {
    console.error(error);
    return;
  }

  debug('dev')('`webpack-dev-server` listening on port %s', config.server.port);
});
