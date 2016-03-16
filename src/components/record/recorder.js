import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class Recorder extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
    onRecordingStop: PropTypes.func.isRequired
  };

  shouldComponentUpdate() {
    return false;
  }

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const node = findDOMNode(this);
    this._initialize(node);
  }

  componentWillUnmount() {
    this._mounted = false;

    if (this._recorder) {
      this._recorder.stopRecording();
      this._recorder = null;
    }

    if (this._mediaStream) {
      this._mediaStream.getAudioTracks().forEach((track) => track.stop());
      this._mediaStream.getVideoTracks().forEach((track) => track.stop());
      this._mediaStream = null;
    }
  }

  render() {
    return (<video className="recorder-component" muted />);
  }

  _initialize(node) {
    const RecordRTC = require('recordrtc');
    const mediaConstraints = {
      audio: true,
      video: true
    };

    const onMediaSuccess = (stream) => {
      this._mediaStream = stream;

      if (typeof node.srcObject !== 'undefined') {
        node.srcObject = stream;
      } else {
        node.src = URL.createObjectURL(stream);
      }

      node.play();

      let stateMode = 'recorder';
      let timer;

      node.addEventListener('ended', () => this.props.onEnd());

      const stopRecording = () => lease.stop();
      const lease = {
        start: () => {
          if (typeof node.srcObject !== 'undefined') {
            node.srcObject = stream;
          } else {
            node.src = URL.createObjectURL(stream);
          }

          stateMode = 'recorder';
          node.muted = true;
          this._recorder = RecordRTC(stream, { type: 'video' });
          this._recorder.setRecordingDuration(60 * 1000, (src) => {
            stateMode = 'playback';
            node.src = src;
            this.props.onRecordingStop();
          });

          this._recorder.startRecording();
        },

        stop: (fn) => {
          this._recorder.stopRecording((src) => {
            stateMode = 'playback';
            node.src = src;
            this.props.onRecordingStop();
          });
        },

        play: () => {
          if (stateMode === 'playback') {
            node.muted = false;
            node.play();
          }
        },

        pause: () => {
          if (stateMode === 'playback') {
            node.pause();
            node.muted = true;
          }
        },

        save: () => {
          if (stateMode === 'playback') {
            return this._recorder.getBlob();
          }
        }
      };

      this.props.onReady(lease)
    };

    const onMediaError = (err) => {
      console.error('media error', err);
    };

    navigator.getUserMedia({ audio: true, video: true }, onMediaSuccess, onMediaError);
  }
}
