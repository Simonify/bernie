import { createStore as createReduxStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'src/reducers';
import universalMiddleware from './universalMiddleware';

export default function createStore(getComposed, initialState) {
  const middleware = [thunk];
  const composers = [universalMiddleware()];
  const composed = getComposed({ middleware, composers, applyMiddleware, compose });
  const _createStore = compose(...composed)(createReduxStore);
  const store = _createStore(enableBatching(rootReducer), initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('src/reducers', () => {
      const nextRootReducer = require('src/reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
