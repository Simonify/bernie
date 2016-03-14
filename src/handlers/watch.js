import React, { Component, PropTypes } from 'react';
import Watch from 'components/watch';
import getVideoById from 'fn/getVideoById';

export default class WatchHandler extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    const id = props.routeParams.id;
    const video = getVideoById(id);

    this.state = { video };
  }

  componentWillReceiveProps(props) {
    if (this.props.routeParams.id !== props.routeParams.id) {
      const video = getVideoById(props.routeParams.id);
      this.setState({ video });
    }
  }

  render() {
    if (!this.state.video) {
      return <div />;
    }

    return <Watch video={this.state.video} />;
  }
}
