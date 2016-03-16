import { Map } from 'immutable';
import { routerReducer } from 'react-router-redux'
import appReducer from './app';
import videosReducer from './videos';
import entitiesReducer from './entities';

const initialState = {
  app: undefined,
  videos: undefined,
  entities: undefined,
  routing: undefined
};

const emptyMap = new Map();

export default function combinedStore(state = initialState, action) {
  if (action.type === 'RESET_STORE') {
    state = {
      ...initialState,
      routing: state.router
    };
  }

  const app = appReducer(state.app, action);
  const entities = entitiesReducer(state.entities, action);
  const routing = routerReducer(state.routing, action);
  const videos = videosReducer(state.videos, action);
  const newState = { app, entities, routing, videos };

  newState.errors = Object.keys(newState).reduce((_errors, key) => {
    const store = newState[key];

    if (store && store.errors) {
      _errors[key] = store.errors;
    } else {
      _errors[key] = emptyMap;
    }

    if (store && store.error) {
      _errors[key] = _errors[key].set('*', store.error);
    }

    return _errors;
  }, {});

  return newState;
}
