import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export class MaterialButton extends Component {
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
    return (<div
      className={"add-button-field " + (
        this.props.large
          ? "large"
          : ""
      )}>
      <div className="add-button" onClick={this.onClick}>
        <h4 className="add-button-text">{this.props.buttonText}</h4>
      </div>
    </div>)
  }
}

MaterialButton.propTypes = {
  buttonText: PropTypes.string,
  large: PropTypes.bool
};
