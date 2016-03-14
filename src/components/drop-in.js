import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { findDOMNode } from 'react-dom';
import ClassName from 'class-name';
import Radium from 'radium';

const STYLES = {
  base: {
    transition: `opacity 250ms ease, transform 250ms ease`,
    opacity: 0
  },

  dropDown: {
    transform: `translateY(-5px)`,
  },

  dropUp: {
    transform: `translateY(5px)`
  },

  inactive: {
    top: -9000,
    left: -9000
  },

  active: {
    display: `block`
  },

  visible: {
    transform: `translateY(0)`,
    opacity: 1
  }
};

@immutableRenderDecorator
@Radium
export default class DropInComponent extends Component {
  static defaultProps = {
    direction: 1,
    visible: false
  };

  static propTypes = {
    direction: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    children: PropTypes.node,
    style: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = { active: false, visible: false };
  }

  componentWillMount() {
    if (this.props.visible) {
      this.setState({ active: true });
    }
  }

  componentWillReceiveProps(props) {
    if (props.visible !== this.props.visible) {
      if (this._timeout) {
        window.clearTimeout(this._timeout);
        this._timeout = null;
      }

      const visible = props.visible ? true : false;

      if (visible) {
        if (!this.state.active) {
          this.setState({ active: visible });
        } else {
          this.setState({ visible, });
        }
      } else {
        this.setState({ visible });
      }
    }
  }

  componentWillUpdate(props, state) {
    if (this.state.active !== state.active && state.active) {
      findDOMNode(this).offsetHeight; // eslint-disable-line no-unused-expressions
      this.setState({ visible: true });
      return;
    }

    if (this.state.visible !== state.visible && !state.visible) {
      this._timeout = window.setTimeout(() => {
        this._timeout = null;
        this.setState({ active: false });
      }, props.slower ? 500 : 250);
    }
  }

  componentWillUnmount() {
    if (this._timeout) {
      window.clearTimeout(this._timeout);
      this._timeout = null;
    }
  }

  render() {
    const direction = (this.props.direction === 1) ? 'down' : 'up';
    const className = ClassName('drop-in-component', `drop-${direction}`, {
      'is-active': this.state.active,
      'is-visible': this.state.visible,
    });

    const style = [
      STYLES.base,
      this.props.direction === 1 ? STYLES.dropDown : STYLES.dropUp
    ];

    if (this.state.active) {
      style.push(STYLES.active);
    } else {
      style.push(STYLES.inactive);
    }

    if (this.state.visible) {
      style.push(STYLES.visible);
    }

    style.push(this.props.style);

    return (
      <div className={className} style={style}>
        {this.props.children}
      </div>
    );
  }
}
