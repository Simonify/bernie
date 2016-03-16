import { normalize } from 'normalizr';
import { CALL_SERVER, CALL_SOCKET, CALL_HTTP } from 'constants/middleware';

function callAction({ http, store, action, method, data }) {
  return http({ store, method, action, data });
}

export default function callServerMiddleware({ http, socket }) {
  const serverMiddleware = store => next => _action => {
    const callServer = _action[CALL_SERVER];

    if (typeof callServer === 'undefined') {
      const callSocket = _action[CALL_SOCKET];

      if (typeof callSocket === 'undefined') {
        const callHttp = _action[CALL_HTTP];

        if (typeof callHttp === 'undefined') {
          return next(_action);
        }

        const { method, action, data } = callHttp;

        if (typeof action !== 'string') {
          throw new Error('You must provide a action.');
        }

        return callAction({ http, store, method, action, data });
      }

      const { action, data } = callSocket;

      if (typeof action !== 'string') {
        throw new Error('You must provide a action.');
      }

      return callAction({ socket, store, action, data });
    }

    const { action, method, params, schema, types } = callServer;

    if (typeof action !== 'string') {
      throw new Error('You must provide a server action.');
    }

    if (typeof method !== 'string') {
      throw new Error('You must provide a server method.');
    }

    if (!Array.isArray(types) || types.length !== 3 || !types.every(type => typeof type === 'string')) {
      throw new Error('You must provide an array of three _action type strings.');
    }

    function _actionWith(data) {
      const finalAction = Object.assign({}, _action, data);
      delete finalAction[CALL_SERVER];
      return finalAction;
    }

    const [requestType, successType, failureType] = types;

    next(_actionWith({ type: requestType }));

    const promise = callAction({ http, socket, store, method, action, params });

    return promise.then((_response) => {
      const response = callServer.response ? callServer.response(_response ) : _response;

      if (schema) {
        return normalize(response, schema);
      }

      return response;
    }).then((response) => {
      next(_actionWith({ response, type: successType }));
      return response;
    }).catch((error) => {
      next(_actionWith({
        type: failureType,
        error: error.message || 'Something bad happened'
      }));

      throw error;
    });
  };

  return serverMiddleware;
}
