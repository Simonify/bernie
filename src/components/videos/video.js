import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';
import ClassName from 'class-name';
import getVideoImage from 'fn/getVideoImage';

@immutableRenderDecorator
@connect(() => ({}), { pushState })
export default class Video extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    video: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this._onClick = ::this._onClick;
    this._onImageLoaded = ::this._onImageLoaded;

    const image = getVideoImage(props.video);
    let loaded = false;

    if (process.env.BROWSER) {
      this._imageNode = document.createElement('img');
      this._imageNode.src = image;
      loaded = typeof this._imageNode.naturalHeight !== 'undefined';
    }

    this.state = { image, loaded };
  }

  componentDidMount() {
    if (!this.state.loaded) {
      if (typeof this._imageNode.naturalHeight !== 'undefined') {
        this._imageNode.addEventListener('load', this._onImageLoaded, false);
      } else {
        this.setState({ loaded: true });
      }
    }
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
          <span className="tag">#{tag}</span>
        </div>
        <div className="image" style={imageStyle} />
      </a>
    );
  }

  _onClick(event) {
    event.preventDefault();
    this.props.pushState(null, `/watch/${this.props.video.get('id')}`);
  }

  _onImageLoaded() {
    this.setState({ loaded: true });
  }
}
