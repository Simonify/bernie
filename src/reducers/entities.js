import { Map, fromJS } from 'immutable';

const defaultState = new Map({
  users: new Map(),
  events: new Map()
});

export default function entities(state = defaultState, action) {
  let newState = state;

  if (action.response && action.response.entities) {
    newState = newState.mergeDeep(action.response.entities);
  }

  if (action.entities) {
    if (action.entities.remove) {
      for (const key in action.entities.remove) {
        if (newState.has(key)) {
          for (const id of action.entities.remove[key]) {
            newState = newState.deleteIn([key, id]);
          }
        }
      }
    }

    if (action.entities.clear) {
      for (const key of action.entities.clear) {
        if (newState.has(key)) {
          newState = newState.set(key, newState.get(key).clear());
        }
      }
    }
  }

  switch (action.type) {
    default:
      if (newState && !(newState instanceof Map)) {
        return fromJS(newState);
      }

      return newState;
  }
}
