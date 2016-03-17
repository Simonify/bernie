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
    const nodes = {
      audio: node.querySelector('audio'),
      video: node.querySelector('video')
    };

    if (typeof window.MRecordRTC === 'function') {
      this._initialize(nodes);
      return;
    }

    const $script = require('scriptjs');

    $script('https://cdn.WebRTC-Experiment.com/RecordRTC.js', () => {
      $script('https://cdn.webrtc-experiment.com/getMediaElement.js', () => {
        $script('https://cdn.webrtc-experiment.com/gumadapter.js', () => {
          if (this._mounted !== false) {
            this._initialize(nodes);
          }
        });
      });
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
    return (
      <div className="recorder-component">
        <video className="recorder-video" />
        <audio className="recorder-audio" />
      </div>
    );
  }

  _initialize(nodes) {
    const onMediaSuccess = (stream) => {
      this._mediaStream = stream;
      this._recorder = new MRecordRTC();
      this._recorder.addStream(stream);
      this._recorder.mediaType = {
        audio: true,
        video: true
      };

      let stateMode;
      let timer;

      function attachRecorder() {
        stateMode = 'recorder';
        nodes.video.muted = true;
        nodes.video.src = URL.createObjectURL(stream);
        nodes.video.play();
      };

      const showRecording = (url, type) => {
        stateMode = 'playback';

        nodes[type].muted = false;
        nodes[type].src = url;
        nodes[type].play();

        nodes[type].onended = () => {
          nodes[type].src = URL.createObjectURL(this._recorder.getBlob()[type]);

          if (type === 'video') {
            this.props.onEnd();
          }
        };

        if (type === 'video') {
          this.props.onRecordingStop();
        }
      };

      const startRecording = () => {
        attachRecorder();
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
            for (const node in nodes) {
              if (nodes.hasOwnProperty(node)) {
                nodes[node].play();
              }
            }
          }
        },

        pause: () => {
          if (stateMode === 'playback') {
            for (const node in nodes) {
              if (nodes.hasOwnProperty(node)) {
                nodes[node].pause();
              }
            }
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

    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(onMediaSuccess).catch(onMediaError);
  }
}
