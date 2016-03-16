import React from 'react';
import Cookies from 'cookies';
import qs from 'qs';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import serveFavicon from 'serve-favicon';
import { match, useRouterHistory, RouterContext, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import routes from 'shared/routes';
import createStore from 'shared/createStore';
import createServerMiddleware from 'shared/createServerMiddleware';
import createHttpRequest from 'shared/createHttpRequest';
import universalRender from 'shared/universalRender';
import createCookieMiddlware from './utils/createCookieMiddleware';

export default function createExpress(config, webpackIsomorphicTools) {
  const { NODE_ENV = 'development' } = process.env;
  const PORT = (parseInt(process.env.PORT, 10) || 2005);
  const server = express();

  server.use(helmet.xframe());
  server.use(helmet.xssFilter());
  server.use(helmet.nosniff());
  server.use(helmet.ienoopen());
  server.disable('x-powered-by');

  server.use(serveFavicon(path.resolve(__dirname, '../assets/images/favicon.ico')));
  server.use(express.static(path.resolve(__dirname, '../assets')));
  server.use('/assets', express.static(path.resolve(__dirname, '../dist')));
  server.use('/images', express.static(path.resolve(__dirname, '../assets/images')));
  server.set('views', path.resolve(__dirname, 'views'));
  server.set('view engine', 'ejs');

  const options = {
    cookies: config.cookies,
    ...config.client
  };

  let httpOptions = options;

  if (config.server.endpoint) {
    httpOptions = { ...httpOptions, serverEndpoint: config.server.endpoint };
  }

  const httpRequest = createHttpRequest(httpOptions);

  server.use((req, res) => {
    if (!req.cookies) {
      req.cookies = new Cookies(req, res);
    }

    const memoryHistory = createMemoryHistory(req.originalUrl);
    const getMiddleware = ({ middleware, composers, applyMiddleware }) => {
      const serverMiddleware = createServerMiddleware({ http: httpRequest });
      const cookieMiddleware = createCookieMiddlware({ req, res, options: options.cookies });
      middleware.push(cookieMiddleware, serverMiddleware, routerMiddleware(memoryHistory));
      const composed = [ applyMiddleware(...middleware) ];
      composed.unshift(...composers);
      return composed;
    };

    const initialState = {};
    const store = createStore(getMiddleware, initialState);
    const history = syncHistoryWithStore(memoryHistory, store);

    match({ history, routes, location: req.originalUrl }, (error, redirectLocation, routerState) => {
      if (error) {
        res.status(500).end();
        return;
      }

      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
        return;
      }

      if (!routerState) {
        res.status(404);
      }

      const assets = webpackIsomorphicTools.assets();

      if (NODE_ENV === 'development') {
        webpackIsomorphicTools.refresh();
      }

      const userAgent = req.headers['user-agent'];

      if (!userAgent) {
        res.status(400).end();
        return;
      }

      universalRender({ store, assets, userAgent, routes, history, options }).then((body) => {
        res.setHeader('Content-type', 'text/html');
        res.end(body);
      }).catch((err) => {
        res.status(500).end();
        console.error(err, err.stack.split('\n'));
      });
    });
  });

  server.listen(PORT);

  console.log('Server listening on port', PORT);

  if (process.send) process.send('online');
}
