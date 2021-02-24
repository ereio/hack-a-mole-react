import React, { Component } from 'react';
import './styles.css';

import colors from 'global/colors';

export class LoadingIndicator extends Component {
  // static propTypes = {
  //   label: PropTypes.string.isRequired,
  //   onChange: PropTypes.func.isRequired
  // };

  render() {
    const { size } = this.props;
    return (
      <div className="spinner" style={{ height: size, width: size }}>
        <div className="double-bounce1" style={{ backgroundColor: colors.primaryAlpha }} />
        <div className="double-bounce2" />
      </div>
    );
  }
}
