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

      let stateMode;
      let timer;

      function attachRecorder() {
        node.srcObject = undefined;
        node.src = '';

        if (typeof node.srcObject !== 'undefined') {
          node.srcObject = stream;
        } else {
          node.src = URL.createObjectURL(stream);
        }

        stateMode = 'recorder';

        node.muted = true;
        node.play();
      };

      const showRecording = (url) => {
        stateMode = 'playback';
        node.srcObject = undefined;
        node.src = url;
        node.muted = false;

        node.onended = () => {
          node.src = url;
          this.props.onEnd();
        };

        node.play();
        this.props.onRecordingStop();
      };

      const startRecording = () => {
        attachRecorder();

        this._recorder = RecordRTC(stream, {
          type: 'video',
          bufferSize: 16384,
          sampleRate: 44100
        });

        this._recorder.setRecordingDuration(60 * 1000, showRecording);
        this._recorder.startRecording();
      };

      const stopRecording = () => {
        /**
         * Add a small delay as it seems to cut off videos early sometimes..
         */
        setTimeout(() => {
          this._recorder.stopRecording(showRecording);
        }, 500);
      };

      const lease = {
        start: startRecording,
        stop: stopRecording,
        reset: attachRecorder,

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

      this.props.onReady(lease);
      attachRecorder();
    };

    const onMediaError = (err) => {
      console.error('media error', err);
    };

    navigator.getUserMedia({ audio: true, video: true }, onMediaSuccess, onMediaError);
  }
}
