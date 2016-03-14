import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

@immutableRenderDecorator
export default class IconComponent extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    style: PropTypes.object
  };

  render() {
    const style = {
      display: `inline-block`,
      backgroundImage: `url('/images/icons/${this.props.size}px/${this.props.id}.png')`,
      backgroundRepeat: `no-repeat`,
      backgroundSize: `${this.props.size}px ${this.props.size}px`,
      width: this.props.size,
      height: this.props.size,
      verticalAlign: `middle`
    };

    return (
      <span className="icon-component" style={this.props.style}>
        <div className="icon" style={style} />
      </span>
    );
  }
}
