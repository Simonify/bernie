import React, { cloneElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { resolveUniversal } from 'shared/universalMiddleware';
import HtmlComponent from 'server/components/Html';

const { BROWSER } = process.env;
const Radium = ({ router, userAgent }) => (
  cloneElement(router, { radiumConfig: { userAgent: userAgent || '' } })
);

export default function universalRender({ store, router, assets, options, userAgent }) {
  const provider = (
    <Provider store={store}>
      <Radium userAgent={userAgent} router={router} />
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
