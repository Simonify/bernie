import { SET_LOCAL_STORAGE } from 'constants/middleware';

export default function createLocalStorageMiddlware() {
  return () => next => action => {
    const setLocalStorage = action[SET_LOCAL_STORAGE];

    if (typeof setLocalStorage === 'undefined') {
      return next(action);
    }

    if (typeof window.localStorage === 'object') {
      window.localStorage.setItem(setLocalStorage.key, setLocalStorage.value);
    }

    const nextAction = { ...action };
    delete nextAction[SET_LOCAL_STORAGE];

    return next(nextAction);
  };
}
