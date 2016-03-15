import { Iterable, Map, Set, fromJS } from 'immutable';
import {
  WINDOW_FOCUSED, WINDOW_BLURRED
} from 'constants/app';

const defaultState = new Map({
  title: process.env.CLIENT_TITLE
});

export default function app(state = defaultState, action) {
  switch (action.type) {
    case WINDOW_FOCUSED:
      return state.set('focused', true);
    case WINDOW_BLURRED:
      return state.set('focused', false);
    default:
      if (!(state instanceof Map)) {
        return fromJS(state, (key, value) => {
          if (key === 'presence') {
            return value.toSet();
          }

          const isIndexed = Iterable.isIndexed(value);
          return isIndexed ? value.toList() : value.toMap();
        });
      }

      return state;
  }
}
