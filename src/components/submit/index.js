import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import ClassName from 'class-name';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import tagOptions from './tags';

@immutableRenderDecorator
@connect(() => ({}), { push })
export default class Submit extends Component {
  static contextTypes = {
    config: PropTypes.object.isRequired
  };

  static propTypes = {
    video: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this._onClick = ::this._onClick;
    this._onSubmit = ::this._onSubmit;
    this._onChangeEmail = ::this._onChangeEmail;
    this._onChangeTags = ::this._onChangeTags;
    this._goToVideo = ::this._goToVideo;
    this.state = { mounted: false, submitting: false, error: null };
  }

  componentDidMount() {
    findDOMNode(this).offsetHeight;
    this.setState({ mounted: true });
  }

  render() {
    const video = this.props.video;
    const className = ClassName('submit-component', 'modal-component', {
      'is-visible': this.state.mounted
    });

    return (
      <div className={className} onClick={this._onClick}>
        <div className="container" onClick={this._onClick}>
          <div className="modal">
            <div className="header">
              <div className="title campaign-font">
                Submit your endorsement video
              </div>
            </div>
            {this.state.submitted ? this.renderSent() : this.renderSubmit()}
          </div>
        </div>
        <div className="overlay" onClick={this._onClick} />
      </div>
    );
  }

  renderSent() {
    const url = `${this.context.config.url}/watch/${this.state.response._id}`;

    return (
      <div className="content">
        <div className="thank-you padded">
          <div className="title campaign-font">Thank you for submitting an endorsement video!</div>
          <div className="body">
            {'You can watch your video right now at '}
            <a href={url} onClick={this._goToVideo}>{url}</a>
            {` and it'll be visible on the homepage very soon!`}
          </div>
        </div>
      </div>
    )
  }

  renderSubmit() {
    return (
      <div className="content">
        <form className="form" onSubmit={this._onSubmit}>
          <div className="rows">
            <label className="row">
              <div className="label">
                Enter your email address (optional):
              </div>
              <input
                type="email"
                className="input"
                placeholder=""
                value={this.state.email}
                disabled={this.state.submitting}
                onChange={this._onChangeEmail}
                autoFocus
              />
              <p className="description">
                Entering an email will let you manage your video once it's
                been added to the site.
              </p>
            </label>
            <label className="row">
              <div className="label">
                Select any tags which you discuss in your video (optional):
              </div>
              <Select
                options={tagOptions}
                value={this.state.tags}
                onChange={this._onChangeTags}
                disabled={this.state.submitting}
                multi
              />
            </label>
          </div>
          <div className="padded">
            {this.renderError()}
            {this.renderButton()}
            <p className="description">
              By submitting your endorsement you grant www.whythebern.com full
              permission to embed and share your video.
            </p>
          </div>
        </form>
      </div>
    );
  }

  renderError() {
    if (this.state.error !== null) {
      let error = this.state.error;

      if (typeof error !== 'string') {
        error = (
          <span>
            <strong>Oops!</strong> An error occured while processing your video -
            please feel free to try submitting again in a few minutes.
          </span>
        );
      }

      return (
        <div className="error">
          {error}
        </div>
      );
    }
  }

  renderButton() {
    const className = ClassName('submit', { 'is-disabled': this.state.submitting });
    let text;

    if (this.state.submitting) {
      if (typeof this.state.progress === 'number') {
        const progress = this.state.progress === 100 ? 'processing' : this.state.progress;
        text = `Submitting Video (${progress})...`;
      } else {
        text = `Submitting Video...`;
      }
    } else {
      text = 'Submit Video';
    }

    return (
      <button className={className} type="submit" disabled={this.state.submitting}>
        {text}
      </button>
    );
  }

  _onClick(event) {
    if (event.target === event.currentTarget) {
      if (!this.state.submitted && !window.confirm('Are you sure you want to exit your endorsement?')) {
        return false;
      }

      event.preventDefault();
      this.setState({ mounted: false });
      setTimeout(() => {
        this.props.push('/');
      }, 550);
    }
  }

  _onSubmit(event) {
    event.preventDefault();
    this.setState({ submitting: true, error: null, progress: null });

    const xhr = new XMLHttpRequest();
    const form = new FormData();

    if (this.state.email) {
      form.append('email', this.state.email);
    }

    if (this.state.tags && this.state.tags.length) {
      form.append('tags', this.state.tags.reduce((tags, { value }) => {
        tags.push(value);
        return tags;
      }, []).join(','));
    }

    form.append('video', this.props.video);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        this.setState({ progress: Math.round((event.loaded / event.total) * 100) });
      }
    });

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.responseText !== '') {
          let json;

          try {
            json = JSON.parse(xhr.responseText);
          } catch (err) {
            return this.setState({ error: true });
          }

          if (json.status === 'ok') {
            return this.setState({ submitted: true, response: json.data });
          }

          this.setState({
            error: (json.data && json.data.message) || true,
            submitting: false,
            progress: null
          });

          return;
        }

        this.setState({ error: true, submitting: false, progress: null });
      }
    });

    xhr.open('post', `${this.context.config.serverEndpoint}/endorse`);
    xhr.send(form);
  }

  _onChangeEmail(event) {
    this.setState({ email: event.currentTarget.value });
  }

  _onChangeTags(tags) {
    this.setState({ tags });
  }

  _goToVideo(event) {
    event.preventDefault();
    this.props.push(`/watch/${this.state.response._id}`);
  }
}
