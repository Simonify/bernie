import Cookies from 'cookies';
import { SET_COOKIE } from 'constants/middleware';

export default function createCookieMiddlware({ req, res, options }) {
  if (!req.cookies) {
    req.cookies = new Cookies(req, res);
  }

  const cookieMiddleware = () => next => action => {
    const setCookie = action[SET_COOKIE];

    if (typeof setCookie === 'undefined') {
      return next(action);
    }

    req.cookies.set(setCookie.key, setCookie.value, options);

    const nextAction = { ...action };
    delete nextAction[SET_COOKIE];

    return next(nextAction);
  };

  return cookieMiddleware;
}
