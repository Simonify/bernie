import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { ReduxRouter } from 'redux-router';
import routes from 'shared/routes';
import universalRender from 'shared/universalRender';
import createServerMiddleware from 'shared/createServerMiddleware';
import createHttpRequest from 'shared/createHttpRequest';
import createAppStore from 'utils/createAppStore';
import createCookieMiddleware from 'utils/createCookieMiddleware';
import createLocalStorageMiddleware from 'utils/createLocalStorageMiddleware';
import createFocusListener from 'utils/createFocusListener';
import trackVisit from 'utils/trackVisit';

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
  const middleware = [localStorageMiddleware, cookieMiddleware, apiMiddleware];
  const store = createAppStore({ state, middleware, routes });
  const router = (<ReduxRouter routes={routes} />);
  const userAgent = window.navigator.userAgent;

  createFocusListener(store);

  universalRender({ history, store, router, userAgent, options: config }).then((element) => {
    render(element, node);
  });

  return { store };
}
