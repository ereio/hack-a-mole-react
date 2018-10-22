import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export class MaterialInput extends Component {

  render() {
    const { onChange, label, type} = this.props;

    return (
    <div className="login-field-container">
      <input className="login-field" type={type} required="required" onChange={onChange} />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className="login-field-label">{label}</label>
    </div>
    )
  }
} 
