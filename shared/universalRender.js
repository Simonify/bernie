import React, { PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { resolveUniversal } from 'shared/universalMiddleware';
import createContext from 'shared/createContext';
import HtmlComponent from 'server/components/Html';

const { BROWSER } = process.env;

export default function universalRender({ store, router, assets, options, userAgent }) {
  const AppWithContext = createContext(router, {
    config: PropTypes.object.isRequired
  }, { config: options });

  const provider = (
    <Provider store={store}>
      <AppWithContext />
    </Provider>
  );

  if (BROWSER) {
    return Promise.resolve(provider);
  }

  renderToString(provider);

  function render() {
    const state = store.getState();
    const body = '<!doctype html>\n' + renderToString((
      <HtmlComponent
        options={options}
        assets={assets}
        children={provider}
        state={state}
      />
    ));

    return body;
  }

  return resolveUniversal(store).then(render).catch((err) => {
    console.log(err.message, err.stack.split('\n'));
    return render();
  });
}
