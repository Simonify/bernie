import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import ReactList from 'react-list';
import videos from 'fn/videos';
import Video from './video';

@immutableRenderDecorator
export default class Videos extends Component {
  static defaultProps = {
    videos
  };

  static propTypes = {
    videos: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.renderItem = ::this.renderItem;
  }

  render() {
    return (
      <div className="videos-component">
        <ReactList
          itemRenderer={this.renderItem}
          length={this.props.videos.size}
          type="uniform"
        />
      </div>
    );
  }

  renderItem(index, key) {
    const video = this.props.videos.valueSeq().get(index);
    return <Video key={key} video={video} />;
  }
}
