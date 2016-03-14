import React from 'react';
import Radium, { Style } from 'radium';

export default Radium(({ rules }) => {
  const styles = [];

  for (const selector in rules) {
    if (rules.hasOwnProperty(selector)) {
      styles.push(<Style rules={rules[selector]} />);
    }
  }

  return (<span children={styles} />);
});
