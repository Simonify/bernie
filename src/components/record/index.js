import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import ClassName from 'class-name';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import Recorder from './recorder';

@immutableRenderDecorator
@connect(() => ({}), { push })
export default class Record extends Component {
  static contextTypes = {
    config: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this._onClick = ::this._onClick;
    this._onRecorderLease = ::this._onRecorderLease;
    this._onRecordingStop = ::this._onRecordingStop;
    this._toggleRecording = ::this._toggleRecording;
    this._togglePlayback = ::this._togglePlayback;
    this._onEnd = ::this._onEnd;
    this._onSubmit = ::this._onSubmit;
    this.state = { mounted: false, ready: false, recording: false, disabled: false };
  }

  componentDidMount() {
    findDOMNode(this).offsetHeight;
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const video = this.props.video;
    const className = ClassName('record-component', 'modal-component', {
      'is-visible': this.state.mounted
    });

    return (
      <div className={className} onClick={this._onClick}>
        <div className="container" onClick={this._onClick}>
          <div className="modal">
            <div className="header">
              <div className="title campaign-font">
                Record a one minute endorsement for Bernie
              </div>
            </div>
            <Recorder
              onReady={this._onRecorderLease}
              onRecordingStop={this._onRecordingStop}
              onEnd={this._onEnd}
            />
            {this.renderActions()}
            {this.renderContent()}
          </div>
        </div>
        <div className="overlay" onClick={this._onClick} />
      </div>
    );
  }

  renderContent() {
    if (!this.state.ready) {
      return (
        <div className="content">
          <span className="loading">Loading...</span>
        </div>
      );
    }
  }

  renderActions() {
    if (!this.state.ready) {
      return null;
    }

    if (this.state.disabled) {
      <div className="actions">
        <div className="loading">
          Working...
        </div>
      </div>
    }

    return (
      <div className="actions">
        <div className="action" onClick={this._toggleRecording}>
          {this.state.recording ? `${this.state.remaining}s remaining - click to stop` : 'Start Recording'}
        </div>
        {!this.state.recording && this.state.video ? (
          <div className="action" onClick={this._togglePlayback}>
            {this.state.playing ? 'Pause' : 'Play'}
          </div>
        ) : null}
        {!this.state.recording && this.state.video ? (
          <div className="action submit" onClick={this._onSubmit}>
            Submit
          </div>
        ) : null}
      </div>
    )
  }

  _onClick(event) {
    if (event.target === event.currentTarget) {
      if (this.state.video && !window.confirm('Are you sure you want to exit your endorsement?')) {
        return false;
      }

      event.preventDefault();
      this.setState({ mounted: false });
      setTimeout(() => {
        this.props.push('/');
      }, 550);
    }
  }

  _onRecorderLease(recorder) {
    this._recorder = recorder;
    this.setState({ ready: true });
  }

  _onRecordingStop() {
    this.setState({
      recording: false,
      disabled: false,
      video: true,
      playing: false
    });
  }

  _toggleRecording(event) {
    event.preventDefault();

    if (this.state.recording) {
      this.setState({ recording: false, disabled: true });
      this._recorder.stop();
    } else {
      if (this.state.video) {
        if (!window.confirm('Are you sure you want to overwrite your current recording?')) {
          return;
        }
      }

      this._recorder.start();
      this.setState({ recording: true, recordingStart: Date.now(), remaining: 60 }, this._updateCountdown);
    }
  }

  _togglePlayback(event) {
    event.preventDefault();

    if (this.state.playing) {
      this.setState({ playing: false });
      this._recorder.pause();
    } else {
      this._recorder.play();
      this.setState({ playing: true });
    }
  }

  _updateCountdown = () => {
    if (this._mounted !== false && this.state.recording) {
      this.setState({
        remaining: Math.max(60 - Math.round((Date.now() - this.state.recordingStart) / 1000, 0))
      });

      setTimeout(this._updateCountdown, 500);
    }
  };

  _onEnd() {
    this.setState({ playing: false });
  }

  _onSubmit(event) {
    this.props.push({ pathname: '/submit', state: { video: this._recorder.save() } });
  }
}
