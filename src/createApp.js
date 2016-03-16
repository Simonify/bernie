import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import routes from 'shared/routes';
import trackVisit from 'utils/trackVisit';
import createAppStore from 'utils/createAppStore';
import universalRender from 'shared/universalRender';
import createHttpRequest from 'shared/createHttpRequest';
import createFocusListener from 'utils/createFocusListener';
import createServerMiddleware from 'shared/createServerMiddleware';
import createCookieMiddleware from 'utils/createCookieMiddleware';
import createLocalStorageMiddleware from 'utils/createLocalStorageMiddleware';

export default function createApp({ state, config }) {
  if (process.env.NODE_ENV !== 'development') {
    trackVisit();
  }

  if (config.domain) {
    document.domain = config.domain;
  }

  const node = document.getElementById('root');
  const http = createHttpRequest(config);
  const cookieMiddleware = createCookieMiddleware(config.cookies);
  const localStorageMiddleware = createLocalStorageMiddleware();
  const apiMiddleware = createServerMiddleware({ http });
  const middleware = [
    localStorageMiddleware,
    cookieMiddleware,
    apiMiddleware,
    routerMiddleware(browserHistory)
  ];

  const store = createAppStore({ state, middleware, routes });
  const history = syncHistoryWithStore(browserHistory, store);
  const userAgent = window.navigator.userAgent;

  createFocusListener(store);

  universalRender({ history, store, routes, userAgent, options: config }).then((element) => {
    render(element, node);
  });

  return { store };
}
