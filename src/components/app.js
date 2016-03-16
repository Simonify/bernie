import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import ClassName from 'class-name';
import Helmet from 'react-helmet';
import Header from './header';
import Home from './home';

@immutableRenderDecorator
export default class AppComponent extends Component {
  static contextTypes = {
    config: PropTypes.object.isRequired
  };

  static propTypes = {
    app: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  constructor(props, context) {
    super(props, context);
    this.state = { headerScrolled: false };
  }

  render() {
    const className = ClassName('app-component');

    return (
      <div className={className} onScroll={this._onScroll}>
        <Helmet title={this.context.config.title} />
        <Header
          onScroll={this._onHeaderScroll}
          scrolled={this.state.headerScrolled}
        />
        <Home />
        {this.props.children}
      </div>
    );
  }

  _onScroll = (event) => {
    if (event.currentTarget.scrollTop > 40) {
      if (!this.state.headerScrolled) {
        this.setState({ headerScrolled: true });
      }
    } else {
      if (this.state.headerScrolled) {
        this.setState({ headerScrolled: false });
      }
    }
  };

  _onHeaderScroll = (event) => {
    event.preventDefault();
    findDOMNode(this).scrollTop += event.deltaY;
  };
}
