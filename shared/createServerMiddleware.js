import { normalize } from 'normalizr';
import { CALL_SERVER, CALL_SOCKET, CALL_HTTP } from 'constants/middleware';

function callAction({ http, store, route, method, data }) {
  return http({ store, method, route, data });
}

export default function callServerMiddleware({ http, socket }) {
  const serverMiddleware = store => next => action => {
    const callServer = action[CALL_SERVER];

    if (typeof callServer === 'undefined') {
      const callSocket = action[CALL_SOCKET];

      if (typeof callSocket === 'undefined') {
        const callHttp = action[CALL_HTTP];

        if (typeof callHttp === 'undefined') {
          return next(action);
        }

        const { method, route, data } = callHttp;

        if (typeof route !== 'string') {
          throw new Error('You must provide a route.');
        }

        return callAction({ http, store, method, route, data });
      }

      const { route, data } = callSocket;

      if (typeof route !== 'string') {
        throw new Error('You must provide a route.');
      }

      return callAction({ socket, store, route, data });
    }

    const { route, method, params, schema, types } = callServer;

    if (typeof route !== 'string') {
      throw new Error('You must provide a server route.');
    }

    if (typeof method !== 'string') {
      throw new Error('You must provide a server method.');
    }

    if (!Array.isArray(types) || types.length !== 3 || !types.every(type => typeof type === 'string')) {
      throw new Error('You must provide an array of three action type strings.');
    }

    function actionWith(data) {
      const finalAction = Object.assign({}, action, data);
      delete finalAction[CALL_SERVER];
      return finalAction;
    }

    const [requestType, successType, failureType] = types;

    next(actionWith({ type: requestType }));

    const promise = callAction({ http, socket, store, method, route, params });

    return promise.then((response) => {
      if (schema) {
        return normalize(response, schema);
      }

      return response;
    }).then((response) => {
      next(actionWith({ response, type: successType }));
      return response;
    }).catch((error) => {
      next(actionWith({
        type: failureType,
        error: error.message || 'Something bad happened'
      }));

      throw error;
    });
  };

  return serverMiddleware;
}
