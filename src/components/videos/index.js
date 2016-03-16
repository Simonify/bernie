import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { connect } from 'react-redux';
import ReactList from 'react-list';
import { fetchVideos } from 'actions/videos';
import videos from 'fn/videos';
import Video from './video';

@connect(({ entities, videos }) => ({
  videos: videos.get('ids').map((id) => entities.getIn(['videos', id]))
}), { fetchVideos })
@immutableRenderDecorator
export default class Videos extends Component {
  static propTypes = {
    fetchVideos: PropTypes.func.isRequired,
    videos: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.renderItem = ::this.renderItem;
  }

  componentWillMount() {
    this.props.fetchVideos();
  }

  render() {
    return (
      <div className="videos-component">
        {this.props.videos.map(this.renderItem)}
      </div>
    );
  }

  renderItem(video) {
    return <Video key={video.get('id')} video={video} />;
  }
}
