import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import ClassName, { PropType as classNamePropType } from 'class-name';

export default class InlineInput extends Component {
  static defaultProps = {
    placeholder: ''
  };

  static propTypes = {
    placeholder: PropTypes.string,
    className: classNamePropType,
    defaultValue: PropTypes.string,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);

    if (typeof props.defaultValue === 'undefined' && typeof props.onChange === 'undefined') {
      window.console.warn('You have not provided an onChange prop, ' +
                          'this InlineInput will be uneditable.');
    }

    this._onChange = ::this._onChange;
    this._onBlur = ::this._onBlur;
    this.state = { value: props.value || props.defaultValue };
  }

  componentWillReceiveProps(props) {
    if (this.props.value !== props.value) {
      this.setState({ value: props.value });
    }
  }

  shouldComponentUpdate(props, state) {
    return this.state.value !== state.value;
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focus();
    }
  }

  render() {
    const value = this.state.value;
    const className = ClassName('inline-input-component', this.props.className, {
      'is-placeholder': (value === '')
    });

    const props = {
      ...this.props, className,
      onInput: this._onChange,
      onBlur: this._onBlur,
      contentEditable: true,
      children: value
    };

    return (<div {...props} />);
  }

  focus() {
    findDOMNode(this).focus();
  }

  getValue() {
    return this.state.value;
  }

  _onBlur(event) {
    this._onChange(event);

    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event);
    }
  }

  _onChange(event) {
    const value = event.target.textContent || event.target.innerText;

    if (this.state.value !== value) {
      if (this.props.defaultValue) {
        this.setState({ value });
      }

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(value);
      }
    }
  }
}
