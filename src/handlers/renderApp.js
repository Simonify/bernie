import React from 'react';
import App from 'components/app';

export default function renderApp(props, handler) {
  const newProps = {
    app: props.app,
    children: props.children,
    entities: props.entities
  };

  return (<App {...newProps} />);
}
