import React, { Component, PropTypes } from 'react';
import Record from 'components/record';

export default class RecordHandler extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired
  };

  render() {
    return (
      <Record />
    );
  }
}
