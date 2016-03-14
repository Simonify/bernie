import React from 'react';
import Cookies from 'cookies';
import qs from 'qs';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import serveFavicon from 'serve-favicon';
import { createMemoryHistory as createHistory } from 'history';
import { ReduxRouter } from 'redux-router';
import { match, reduxReactRouter } from 'redux-router/server';
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

    const getMiddleware = ({ middleware, composers, applyMiddleware }) => {
      const serverMiddleware = createServerMiddleware({ http: httpRequest });
      const cookieMiddleware = createCookieMiddlware({ req, res, options: options.cookies });

      middleware.push(cookieMiddleware, serverMiddleware);

      const composed = [
        applyMiddleware(...middleware),
        reduxReactRouter({ routes, createHistory })
      ];

      composed.unshift(...composers);

      return composed;
    };

    const initialState = {};
    const store = createStore(getMiddleware, initialState);

    store.dispatch(match(req.originalUrl, (error, redirectLocation, routerState) => {
      if (error) {
        res.status(500).end();
        return;
      }

      if (redirectLocation) {
        res.redirect(redirectLocation);
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

      const router = (<ReduxRouter />);

      universalRender({ store, assets, userAgent, router, options }).then((body) => {
        res.setHeader('Content-type', 'text/html');
        res.end(body);
      }).catch((err) => {
        res.status(500).end();
        console.error(err, err.stack.split('\n'));
      });
    }));
  });

  server.listen(PORT);

  console.log('Server listening on port', PORT);

  if (process.send) process.send('online');
}
