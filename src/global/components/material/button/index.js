import React, { Component } from 'react';

import './styles.css';

import { LoadingIndicator } from '../loading';

export class MaterialButton extends Component {
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
      large, disabled, buttonText, loading,
    } = this.props;
    let containerStyles = 'material-button-field';
    containerStyles += large ? ' large' : '';

    let buttonStyles = 'material-button';
    buttonStyles += disabled ? ' disabled ' : '';

    return (
      <div className={containerStyles}>
        <div className={buttonStyles} tabIndex={0} role="button" onClick={this.onClick} onKeyUp={this.onClick}>
          {
            loading ? (<LoadingIndicator />)
              : (
                <div className="button-text">
                  {buttonText || this.props.children}
                </div>
              )
          }
        </div>
      </div>
    );
  }
}
