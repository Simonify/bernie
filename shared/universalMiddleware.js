import debug from 'debug';
import { applyMiddleware } from 'redux';

export default function createUniversalMiddleware() {
  let store;

  const middleware = () => {
    return next => action => {
      // BROWSER or internal events can skip through
      if (
        store._universal.resolved ||
        process.env.BROWSER ||
        (action.type && action.type.substr(0, 2) === '@@')
      ) {
        return next(action);
      }

      store._universal.resolve.push(() => next(action));
    };
  };

  return (createStore) => {
    return (reducer, initialState) => {
      store = applyMiddleware(middleware)(createStore)(reducer, initialState);
      store._universal = { resolve: [], resolved: false };
      return store;
    };
  };
}

export function resolveUniversal(store) {
  if (store._universal.resolve.length) {
    debug('dev')('Pending universal actions', store._universal.resolve);

    const promises = [];

    for (const resolver of store._universal.resolve) {
      const promise = resolver();

      if (typeof promise.then === 'function') {
        promises.push(promise);
      }
    }

    store._universal.resolve = [];

    return Promise.all(promises);
  }

  return Promise.resolve();
}
