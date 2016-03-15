import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ClassName from 'class-name';

@immutableRenderDecorator
@connect(() => ({}, { pushState }))
export default class Header extends Component {
  static propTypes = {
    scrolled: PropTypes.bool.isRequired,
    pushState: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this._onClickSubmit = ::this._onClickSubmit;
  }

  render() {
    const className = ClassName('header-component', { 'is-scrolled': this.props.scrolled });

    return (
      <div className={className}>
        <div className="default container">
          <div className="left">
            <a className="logo campaign-font" href="/" target="_self">
              #EndorseTheBern
            </a>
          </div>
          <div className="right">
            <a className="btn" href="/submit" onClick={this._onClickSubmit}>
              Submit your own video
            </a>
          </div>
        </div>
        <div className="scrolled container">
          <div className="center">
            <a className="logo campaign-font" href="/" target="_self">
              #EndorseTheBern
            </a>
          </div>
          <div className="right">
            <a className="btn" href="/submit" onClick={this._onClickSubmit}>
              Submit your own video
            </a>
          </div>
        </div>
      </div>
    );
  }

  _onClickSubmit(event) {
    event.preventDefault();
    this.props.pushState(null, '/submit');
  }
}
