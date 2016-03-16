import React, { Component, PropTypes } from 'react';
import Submit from 'components/submit';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

@connect(() => ({}), { push })
export default class SubmitHandler extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  };

  render() {
    if (!this.props.location.state || !(this.props.location.state.video instanceof global.Blob)) {
      return;
    }

    return (
      <Submit video={this.props.location.state.video} />
    );
  }
}
