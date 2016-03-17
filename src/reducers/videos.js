import { Iterable, Map, OrderedSet, fromJS } from 'immutable';
import { FETCH_VIDEOS_SUCCESS } from 'constants/videos';

const defaultState = new Map({
  ids: new OrderedSet()
});

export default function app(state = defaultState, action) {
  switch (action.type) {
    case FETCH_VIDEOS_SUCCESS:
      return state.set('ids', state.get('ids').union(action.response.result.videos));
    default:
      if (!(state instanceof Map)) {
        return fromJS(state, (key, value) => {
          const isIndexed = Iterable.isIndexed(value);
          return isIndexed ? value.toOrderedSet() : value.toMap();
        });
      }

      return state;
  }
}
