import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchVideo } from 'actions/videos';
import getOpenGraph from 'fn/getOpenGraph';
import Watch from 'components/watch';

@connect(({ entities }) => ({ videos: entities.get('videos') }), { fetchVideo, push })
export default class WatchHandler extends Component {
  static contextTypes = {
    config: PropTypes.object.isRequired
  };

  static propTypes = {
    fetchVideo: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    videos: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._videoNotFound = ::this._videoNotFound;

    const id = props.routeParams.id;
    let video;

    if (props.videos.has(id)) {
      video = props.videos.get(id);
    }

    this.state = { video };
  }

  componentWillMount() {
    if (!this.state.video) {
      this.props.fetchVideo(this.props.routeParams.id);
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.routeParams.id !== props.routeParams.id) {
      const id = props.routeParams.id;
      const video = props.videos.get(id);

      this.setState({ video });

      if (!video) {
        props.fetchVideo(id).catch(this._videoNotFound);
      }
    }
  }

  render() {
    if (!this.state.video) {
      return <div />;
    }

    return (
      <div className="handler">
        <Helmet meta={getOpenGraph(this.state.video, this.context.config)} />
        <Watch video={this.state.video} />
      </div>
    );
  }

  _videoNotFound() {
    this.props.push('/');
  }
}
