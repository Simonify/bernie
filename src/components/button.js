import React from 'react';
import Radium from 'radium';

const styles = {
  component: {
    display: `inline`,
    borderRadius: 2,
    borderWidth: 1,
    borderStyle: `solid`,
    fontSize: 13,
    fontWeight: 500,
    justifyContent: `center`,
    whiteSpace: `nowrap`,
    textOverflow: `ellipsis`,
    overflow: `hidden`,
    cursor: `pointer`,
    userSelect: `none`
  },
  white: {
    borderColor: `rgba(255, 255, 255, 0.3)`,
    color: `#FFFFFF`,
    ':hover': {
      backgroundColor: `#FFFFFF`,
      color: `#333`,
      boxShadow: `0px 0px 6px 8px rgba(255, 255, 255, 0.1)`
    }
  },
  big: {
    padding: `6px 12px 8px`,
  },
  small: {
    height: 20
  },
  disabled: {
    cursor: `default`,
    opacity: 0.8,
    ':hover': {
      backgroundColor: '',
      color: `#FFFFFF`,
      boxShadow: ''
    }
  }
};

const ButtonComponent = Radium((props) => {
  const style = [
    props.style,
    styles.component,
    props.small ? styles.small : styles.big,
    props.color && styles[props.color] ? styles[props.color] : styles.white,
    props.disabled && styles.disabled
  ];

  const newProps = {
    ...props,
    style
  };

  return (<div {...newProps} />);
});

export default ButtonComponent;
