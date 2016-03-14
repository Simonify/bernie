import React, { Component, PropTypes } from 'react';
import { renderToString } from 'react-dom/server';
import { FONT_FAMILY, FONT_COLOR } from 'shared/constants/styles';

const styles = {
  reset: {
    margin: 0,
    padding: 0,
    width: `100%`,
    height: `100%`,
    border: `none`,
    outline: `none`
  },
  body: {
    fontFamily: FONT_FAMILY,
    color: FONT_COLOR,
    WebkitOverflowScrolling: `touch`
  },
  root: {
    position: `fixed`,
    display: `flex`,
    width: `100%`,
    height: `100%`
  }
};

export default class HtmlComponent extends Component {
  static propTypes = {
    assets: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    options: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
  };

  render() {
    const __html = this.props.children ? renderToString(this.props.children) : null;
    const styleKeys = Object.keys(this.props.assets.styles);

    return (
      <html lang="en" style={styles.reset}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
          <title>{this.props.options.title}</title>
          {styleKeys.map((style, i) => (
            <link href={this.props.assets.styles[style]} key={i} media="screen, projection" rel="stylesheet" type="text/css" />
          ))}
        </head>
        <body style={{ ...styles.reset, ...styles.body }}>
          <div id="root" style={styles.root} dangerouslySetInnerHTML={{ __html }} />
          <script dangerouslySetInnerHTML={{
            __html: `window._state = ${JSON.stringify({ state: this.props.state, config: this.props.options })}`
          }} />
          {Object.keys(this.props.assets.javascript).map((script, i) => (
            <script async defer src={this.props.assets.javascript[script]} key={i} />
          ))}
        </body>
      </html>
    );
  }
}
