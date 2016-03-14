import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import Videos from 'components/videos';

@immutableRenderDecorator
export default class Home extends Component {
  render() {
    return (
      <div className="home-component">
        <div className="pitch">
          <div className="container">
            <h1>Every day thousands of Americans endorse <em>Bernie Sanders</em> for president.</h1>
            <h2>Click a video below to hear why someone just like you is voting for <em>Bernie</em> — directly from them.</h2>
          </div>
          <div className="overlay" />
        </div>
        <Videos />
      </div>
    );
  }
}
