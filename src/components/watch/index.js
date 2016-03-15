import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';
import ClassName from 'class-name';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { YOUTUBE } from 'constants/videos';

@immutableRenderDecorator
@connect(() => ({}), { pushState })
export default class Video extends Component {
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
      case YOUTUBE:
        const src = `https://www.youtube.com/embed/${this.props.video.get('id')}?autoplay=1&modestbranding=on`;
        return (
          <iframe
            className="iframe"
            src={src}
            allowFullScreen
          />
        );
      default:
        return null;
    }
  }

  _onClick(event) {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      this.setState({ mounted: false });
      setTimeout(() => {
        this.props.pushState(null, '/');
      }, 550);
    }
  }
}
