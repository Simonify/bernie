import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import ClassName from 'class-name';

@connect(() => ({}), { push })
export default class Header extends Component {
  static propTypes = {
    scrolled: PropTypes.bool.isRequired,
    onScroll: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this._onMouseWheel = ::this._onMouseWheel;
    this._onClickSubmit = ::this._onClickSubmit;
  }

  render() {
    const className = ClassName('header-component', { 'is-scrolled': this.props.scrolled });

    return (
      <div className={className} onWheel={this._onMouseWheel}>
        <div className="default container">
          <div className="left">
            <a className="logo campaign-font" href="/" target="_self">
              Why The Bern?
            </a>
          </div>
          <div className="right">
            {this.renderRecord()}
          </div>
        </div>
        <div className="scrolled container">
          <div className="center">
            <a className="logo campaign-font" href="/" target="_self">
              Why The Bern?
            </a>
          </div>
          <div className="right">
            {this.renderRecord()}
          </div>
        </div>
      </div>
    );
  }

  renderRecord() {
    if (window.navigator.userAgent.indexOf('Chrome/') > -1) {
      return (
        <a className="btn" href="/record" onClick={this._onClickSubmit}>
          Record your own video
        </a>
      );
    }

    return null;
  }

  _onMouseWheel(event) {
    this.props.onScroll(event);
  }

  _onClickSubmit(event) {
    event.preventDefault();
    this.props.push('/record');
  }
}
