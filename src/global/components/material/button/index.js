import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export class MaterialButton extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    large: PropTypes.bool
  };

  constructor(){
    super();

    this.onClick = this.onClick.bind(this); 
  }

  onClick() {
    const { disabled, onClick } = this.props; 
    if(!disabled) {
      onClick(); 
    }
  }

  render() {
    const {large, disabled, buttonText} = this.props; 
    let containerStyles = "add-button-field ";
    containerStyles += large ? "large " : "";

    let buttonStyles = "add-button "
    buttonStyles += disabled ? "disabled " : "";

    return (
    <div className={containerStyles}>
      <div className={buttonStyles} onClick={this.onClick}>
        <div className="add-button-text">{buttonText}</div>
      </div>
    </div>)
  }
} 
