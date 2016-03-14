import Cookies from 'cookies-js';
import { SET_COOKIE } from 'constants/middleware';

export default function createCookieMiddlware(options) {
  Cookies.defaults = options;

  const cookieMiddleware = () => next => action => {
    const setCookie = action[SET_COOKIE];

    if (typeof setCookie === 'undefined') {
      return next(action);
    }

    Cookies.set(setCookie.key, setCookie.value);

    const nextAction = { ...action };
    delete nextAction[SET_COOKIE];

    return next(nextAction);
  };

  return cookieMiddleware;
}
