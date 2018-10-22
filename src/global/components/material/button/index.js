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
    let styles = "add-button-field ";
    styles += this.props.large ? "large " : "";
    styles += this.props.disabled ? "disabled " : "";

    return (
    <div className={styles}>
      <div className="add-button" onClick={this.onClick}>
        <div className="add-button-text">{this.props.buttonText}</div>
      </div>
    </div>)
  }
} 
