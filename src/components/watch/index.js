import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ClassName from 'class-name';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { YOUTUBE, RECORDER } from 'constants/videos';

@immutableRenderDecorator
@connect(() => ({}), { push })
export default class Watch extends Component {
  static contextTypes = {
    config: PropTypes.object.isRequired
  };

  static propTypes = {
    video: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this._onClick = ::this._onClick;
    this.state = { mounted: false };
  }

  componentDidMount() {
    findDOMNode(this).offsetHeight;
    this.setState({ mounted: true });

    if (typeof FB === 'object' && typeof FB.XFBML === 'object') {
      FB.XFBML.parse && FB.XFBML.parse();
    }
  }

  render() {
    const video = this.props.video;
    const className = ClassName('watch-component', { 'is-visible': this.state.mounted });
    const url = `${this.context.config.url}/watch/${video.get('id')}`;

    return (
      <div className={className} onClick={this._onClick}>
        <div className="container" onClick={this._onClick}>
          <div className="video">
            {this.renderVideo()}
          </div>
          <div className="share">
            <div
              className="fb-share-button"
              data-layout="button_count"
              data-href={url}
            />
          </div>
        </div>
        <div className="overlay" onClick={this._onClick} />
      </div>
    );
  }

  renderVideo() {
    switch (this.props.video.get('type')) {
      case YOUTUBE: {
        const src = `https://www.youtube.com/embed/${this.props.video.get('service_id')}?autoplay=1&modestbranding=on`;
        return (
          <iframe
            className="iframe"
            src={src}
            allowFullScreen
          />
        );
      }

      case RECORDER: {
        const src = `${this.context.config.staticHost || ''}/${this.props.video.get('id')}/video.mp4`;

        return (
          <video className="video" src={src} controls autoPlay />
        );
      }

      default:
        return null;
    }
  }

  _onClick(event) {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      this.setState({ mounted: false });
      setTimeout(() => {
        this.props.push('/');
      }, 550);
    }
  }
}
