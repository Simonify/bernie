import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ClassName from 'class-name';
import getVideoImage from 'fn/getVideoImage';

@immutableRenderDecorator
@connect(() => ({}), { push })
export default class Video extends Component {
  static contextTypes = {
    config: PropTypes.object.isRequired
  };

  static propTypes = {
    push: PropTypes.func.isRequired,
    video: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this._onClick = ::this._onClick;
    this._onImageLoaded = ::this._onImageLoaded;

    const image = getVideoImage(props.video, this.context.config);

    this.state = { image, loaded: false };
  }

  componentDidMount() {
    this._imageNode = document.createElement('img');
    this._imageNode.addEventListener('load', this._onImageLoaded, false);
    this._imageNode.src = this.state.image;
  }

  componentWillUnmount() {
    this._imageNode.removeEventListener('load', this._onImageLoaded, false);
  }

  render() {
    const video = this.props.video;
    const className = ClassName('video-component', { 'is-loaded': this.state.loaded });
    const imageStyle = this.state.loaded ? {
      backgroundImage: `url('${this.state.image}')`
    } : null;

    let tag = this.props.video.get('tags').toArray();

    if (tag.length === 1) {
      tag = tag[0];
    } else {
      tag = tag[Math.floor(Math.random() * tag.length)];
    }

    return (
      <a className={className} href={`/watch/${video.get('id')}`} onClick={this._onClick}>
        <div className="container">
          {tag ? (<span className="tag">#{tag}</span>) : null}
        </div>
        <div className="image" style={imageStyle} />
      </a>
    );
  }

  _onClick(event) {
    event.preventDefault();
    this.props.push(`/watch/${this.props.video.get('id')}`);
  }

  _onImageLoaded() {
    this.setState({ loaded: true });
  }
}
