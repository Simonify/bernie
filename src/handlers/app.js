import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import mapStateToProps from './mapStateToProps';
import renderApp from './renderApp';

@connect(mapStateToProps)
export default class AppHandler extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    entities: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  render() {
    return renderApp(this.props);
  }
}
