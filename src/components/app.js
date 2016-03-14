import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import ClassName from 'class-name';
import Header from './header';
import Home from './home';

@immutableRenderDecorator
export default class AppComponent extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
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
        <Header scrolled={this.state.headerScrolled} />
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
}
