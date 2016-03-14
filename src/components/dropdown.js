import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { findDOMNode, render, unmountComponentAtNode } from 'react-dom';
import ClassName, { PropType as classNamePropType } from 'class-name';
import Radium from 'radium';
import isChildOf from 'utils/isChildOf';
import findScrollParent from 'utils/findScrollParent';
import DropdownOptions from './dropdown/options';
import { display } from './dropdown/styles';

@immutableRenderDecorator
@Radium
export default class DropdownComponent extends Component {
  static defaultProps = {
    disabled: false
  };

  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    options: PropTypes.object.isRequired,
    className: classNamePropType,
    children: PropTypes.node,
    closeOnSelect: PropTypes.func,
    onChange: PropTypes.func,
    selected: PropTypes.string,
    style: PropTypes.object,
    visible: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    this._domBound = false;
    this._proxyNode = null;
    this._onClick = ::this._onClick;
    this._onDOMClick = ::this._onDOMClick;
    this._selectOption = ::this._selectOption;
    this.state = this._getDefaultState();
    this.state.visible = props.visible === true;
  }

  componentDidMount() {
    this._mountProxy();
    this._renderOptionsInProxy();
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.visible) {
      if (!this.state.visible) {
        this._optionsDidHide();
        return;
      }

      this._renderOptionsInProxy();
      return;
    }

    if (this.state.visible) {
      if (!oldState.visible) {
        this._optionsDidAppear();
        return;
      }

      this._renderOptionsInProxy();
      return;
    }
  }

  componentWillUnmount() {
    if (this.state.visible) {
      this._optionsDidHide();
    }

    this._unmountProxy();
  }

  render() {
    const className = ClassName('dropdown-component', this.props.className, {
      'is-disabled': this.props.disabled
    });

    const styles = [display.base, this.props.style];

    if (this.props.disabled) {
      styles.push(display.disabled);
    }

    return (
      <div className={className} onClick={this._onClick} style={styles}>
        {this.props.children}
      </div>
    );
  }

  _getDefaultState() {
    return {
      top: null,
      left: null,
      visible: false,
      arrow: {
        style: {},
        top: null,
        bottom: null
      }
    };
  }

  _showOptions() {
    if (!this.state.visible) {
      this.setState({ visible: true });
    }
  }

  _hideOptions() {
    if (this.state.visible) {
      this.setState({ visible: false });
    }
  }

  _onClick(event) {
    if (this._domBound === false) {
      event.preventDefault();
      event.stopPropagation();

      if (this.props.disabled !== true) {
        this._showOptions();
      }
    }
  }

  _optionsDidAppear() {
    this._renderOptionsInProxy();
    this._positionProxy();
    this._bindDOMEvents();
  }

  _optionsDidHide() {
    this._renderOptionsInProxy();
    this._unbindDOMEvents();
  }

  _mountProxy() {
    if (!this._proxyNode) {
      const node = document.createElement('span');
      node.className = 'dropdown-options-portal';
      this._proxyNode = node;
      document.body.appendChild(this._proxyNode);
      return;
    }

    throw new Error('proxy is already set');
  }

  _unmountProxy() {
    if (this._proxyNode) {
      unmountComponentAtNode(this._proxyNode);
      this._proxyNode.parentNode.removeChild(this._proxyNode);
      this._proxyNode = null;
      return;
    }

    throw new Error('no proxy node defined');
  }

  _renderOptionsInProxy() {
    if (this._proxyNode) {
      const options = (
        <DropdownOptions
          {...this.state}
          options={this.props.options}
          selectOption={this._selectOption}
        />
      );

      render(options, this._proxyNode);
      return;
    }

    throw new Error('no proxy node defined');
  }

  _positionProxy() {
    if (this._proxyNode) {
      const node = findDOMNode(this);
      const optionsNode = this._proxyNode.childNodes[0];
      const scrollParent = findScrollParent(node);
      const domOffset = node.getBoundingClientRect();
      const top = domOffset.top;
      const state = { ...this._getDefaultState(), visible: this.state.visible };
      const displayHeight = node.offsetHeight;
      const displayWidth = node.offsetWidth;
      const optionsHeight = optionsNode.offsetHeight;
      const optionsWidth = optionsNode.offsetWidth;
      const bodyHeight = document.body.clientHeight;
      const left = domOffset.left - scrollParent.scrollLeft;
      const arrowHeight = 6;

      if ((top + displayHeight + optionsHeight) < bodyHeight) {
        state.top = top + displayHeight;
        state.arrow.top = true;
      } else {
        state.top = top - optionsHeight - arrowHeight;
        state.arrow.bottom = true;
      }

      state.left = (left - (optionsWidth / 2) + (displayWidth / 2));

      this.setState(state);
    }
  }

  _bindDOMEvents() {
    if (!this._domBound) {
      if (this._proxyNode) {
        this._domBound = true;
        document.body.addEventListener('click', this._onDOMClick, false);
        return;
      }

      throw new Error('no proxy node is defined');
    }

    throw new Error('dom is already bound');
  }

  _onDOMClick(event) {
    if (this._domBound) {
      const node = findDOMNode(this);

      if (
        isChildOf(node, event.target) ||
        !isChildOf(this._proxyNode, event.target)
      ) {
        event.preventDefault();
        event.stopPropagation();
        this._hideOptions();
      }

      return;
    }

    throw new Error('event listener bound after unmount');
  }

  _unbindDOMEvents() {
    if (this._domBound) {
      if (this._proxyNode) {
        this._domBound = false;
        document.body.removeEventListener('click', this._onDOMClick, false);
        return;
      }

      throw new Error('no proxy node is defined');
    }

    throw new Error('dom is already bound');
  }

  _selectOption(option, event) {
    const onClick = option.get('onClick');
    let canHide = true;

    if (onClick) {
      canHide = onClick(event);
    }

    if (this.props.onChange) {
      const onChange = this.props.onChange(option);

      if (canHide === true && onChange === false) {
        canHide = false;
      }
    }

    if (canHide !== false && this.props.closeOnSelect !== false) {
      this._hideOptions();
    }
  }

  _getSelectedOption() {
    if (this.props.selected) {
      return this.props.options.find((option) => option.get('id') === this.props.selected);
    }

    return null;
  }
}
