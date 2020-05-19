import React, { Component } from 'react';

import './styles.css';

export class TouchableButton extends Component {
  // static propTypes = {
  //   buttonText: PropTypes.string,
  //   large: PropTypes.bool
  // };

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { disabled, onClick } = this.props;
    if (!disabled) {
      onClick();
    }
  }

  render() {
    const {
      large, start, end, disabled,
    } = this.props;
    let containerStyles = 'touchable-button-field';
    containerStyles += large ? ' large' : '';
    containerStyles += end ? ' end' : '';
    containerStyles += start ? ' start' : '';

    let buttonStyles = 'touchable-button';
    buttonStyles += disabled ? ' disabled' : '';

    return (
      <div className={containerStyles} onClick={this.onClick}>
        <div className={buttonStyles}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
