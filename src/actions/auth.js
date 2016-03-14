import { normalize } from 'normalizr';
import { CALL_SOCKET, SET_COOKIE } from 'constants/middleware';
import schemas from 'utils/schemas';

import {
  AUTHENTICATE, UNAUTHENTICATE, SET_TOKEN, UNSET_TOKEN, SET_REQUIRE_AUTH,
  SET_USER, SET_AUTHENTICATING
} from 'constants/auth';

export function setUser(user) {
  return {
    type: SET_USER,
    response: normalize({ user }, schemas),
    user
  };
}

export function setToken(token) {
  return (dispatch, getState) => {
    const state = getState();

    if (state.auth.get('token') !== token) {
      return dispatch({
        [SET_COOKIE]: {
          key: 'token',
          value: token
        },
        type: SET_TOKEN,
        token
      });
    }
  };
}

export function unsetToken() {
  return (dispatch) => dispatch({
    [SET_COOKIE]: { key: 'token', value: undefined },
    type: UNSET_TOKEN,
  });
}

export function setRequireAuth(requireAuthentication) {
  if (typeof requireAuthentication === 'object') {
    return { type: SET_REQUIRE_AUTH, requireAuthentication: true, options: requireAuthentication };
  }

  return { type: SET_REQUIRE_AUTH, requireAuthentication };
}

export function setAuthenticating(authenticating) {
  return { type: SET_AUTHENTICATING, authenticating };
}

export function authenticate({ token, username, password }) {
  return (dispatch) => dispatch({
    type: AUTHENTICATE,
    username,
    [CALL_SOCKET]: {
      route: 'user.authenticate',
      data: { token, username, password }
    }
  }).then(({ token: newToken, user }) => Promise.all([
    dispatch(setToken(newToken)),
    dispatch(setUser(user))
  ]));
}

export function unauthenticate(token) {
  return (dispatch) => dispatch({
    type: UNAUTHENTICATE,
    [CALL_SOCKET]: {
      route: 'user.unauthenticate',
      data: { token }
    }
  }).then(() => Promise.all([
    dispatch(setToken(null)),
    dispatch(setUser(null))
  ]));
}
