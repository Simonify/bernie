import { Map } from 'immutable';
import { routerStateReducer } from 'redux-react-router';
import appReducer from './app';
import entitiesReducer from './entities';

const initialState = {
  app: undefined,
  entities: undefined,
  router: undefined
};

const emptyMap = new Map();

export default function combinedStore(state = initialState, action) {
  if (action.type === 'RESET_STORE') {
    state = {
      ...initialState,
      router: state.router
    };
  }

  const app = appReducer(state.app, action);
  const entities = entitiesReducer(state.entities, action);
  const router = routerStateReducer(state.router, action);
  const newState = { app, entities, router };

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
