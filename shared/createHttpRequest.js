import fetch from 'isomorphic-fetch';
import debug from 'debug';

const HTTP_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export default function createHttpRequest(props) {
  return function httpRequest({ method, route, data: baseParams }) {
    const params = baseParams;

    let url = `${props.serverEndpoint}/${route}`;
    let body;

    if (typeof params === 'object') {
      if (typeof params.id === 'string') {
        url += `/${params.id}`;
        delete params.id;
      }

      body = JSON.stringify(params);
    }

    const options = { credentials: 'include', headers: HTTP_HEADERS, method, body };
    const parseJSON = (response) => response.json().then((json) => ({ json, response }));

    return fetch(url, options).then(parseJSON).then(({ json }) => json, (err) => {
      if (!process.env.BROWSER) {
        debug('dev')('API proxy failed', err);
      }

      throw new Error('App is currently offline.');
    });
  };
}
