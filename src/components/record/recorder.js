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

    if (typeof window.MRecordRTC === 'function') {
      this._initialize(node);
      return;
    }

    const $script = require('scriptjs');

    $script('https://cdn.WebRTC-Experiment.com/RecordRTC.js', () => {
      if (this._mounted !== false) {
        this._initialize(node);
      }
    });
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

  _initialize(videoNode) {
    const mediaConstraints = {
      audio: true,
      video: true
    };

    const onMediaSuccess = (stream) => {
      this._mediaStream = stream;

      let stateMode;
      let timer;

      function attachRecorder() {
        videoNode.muted = true;
        videoNode.src = URL.createObjectURL(stream);
        stateMode = 'recorder';
        videoNode.play();
      };

      const showRecording = () => {
        this._recorder.getBlob(({ audio, video }) => {
          stateMode = 'playback';

          videoNode.src = URL.createObjectURL(video);
          videoNode.muted = false;

          videoNode.onended = () => {
            videoNode.src = URL.createObjectURL(video);
            this.props.onEnd();
          };

          videoNode.play();
          this.props.onRecordingStop();
        });
      };

      const startRecording = () => {
        attachRecorder();

        this._recorder = new MRecordRTC();
        this._recorder.addStream(stream);
        this._recorder.mediaType = {
          audio: true,
          video: true
        };

        this._recorder.startRecording();
      };

      const stopRecording = (a,b) => {
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
            videoNode.play();
          }
        },

        pause: () => {
          if (stateMode === 'playback') {
            videoNode.pause();
          }
        },

        save: () => {
          if (stateMode === 'playback') {
            return this._recorder.getBlob().video;
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
