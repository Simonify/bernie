import createLogger from 'redux-logger';
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import createStore from 'shared/createStore';

export default function createAppStore({ state, middleware: _middleware, routes }) {
  let mixedMiddleware = Array.isArray(_middleware) ? _middleware : [];

  const compose = ({ middleware, composers, applyMiddleware }) => {
    mixedMiddleware = middleware.concat(mixedMiddleware);

    const composed = [
      applyMiddleware(...mixedMiddleware),
      reduxReactRouter({ routes, createHistory }),
      applyMiddleware(createLogger({
        predicate: () => window.__logger !== false
      }))
    ];

    composed.unshift(...composers);

    return composed;
  };

  return createStore(compose, state);
}
